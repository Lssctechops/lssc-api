# BaseController: A Comprehensive Guide

A reusable, generic controller for Mongoose models implementing full CRUD plus pagination, filtering, hooks, access control, and more—so you can get up and running in minutes and customize as you grow.

---

## 📖 Table of Contents

1. [Overview](#overview)  
2. [Quick Start (Easy Example)](#quick-start)  
3. [Express Route Setup](#express-route-setup)  
4. [Configuration Options](#configuration-options)  
5. [Feature Deep Dive](#feature-deep-dive)  
   - [5.1 Filtering & Query Params](#filtering--query-params)  
   - [5.2 Pagination](#pagination)  
   - [5.3 Access Control](#access-control)  
   - [5.4 Field Selection & Population](#field-selection--population)  
   - [5.5 Full-Text Search](#full-text-search)  
   - [5.6 Pre/Post Hooks](#prepost-hooks)  
   - [5.7 `getAll` (No Pagination)](#getall-no-pagination)  
6. [Full Example (All Features)](#full-example)  
7. [Best Practices & Tips](#best-practices--tips)  

---

## Overview

`BaseController` is a class you instantiate with a Mongoose model and a simple config object. It gives you:

- ✅ **CRUD** – `get()`, `getById()`, `create()`, `updateById()`, `deleteById()`, plus `getAll()`  
- 🔍 **Filtering** via route params & query strings  
- 📄 **Pagination** with safe limits  
- 🔒 **Role-based access control** (`admin` vs. `user`-scoped)  
- 🔗 **Populate & select** fields  
- 🔎 **Text search** (MongoDB `$text`)  
- 🪝 **Pre/Post hooks** for customizing logic  

---

## Quick Start (Easy Example)

1. **Import & instantiate**  
   ```js
   const BaseController = require('./BaseController');
   const Book = require('./models/Book'); // your Mongoose model

   // Minimal config: just model name
   const bookController = new BaseController(Book, {
     name: 'Book',
     // everything else uses sensible defaults
   });
   ```

2. **Wire up Express routes**  
   ```js
   const express = require('express');
   const router = express.Router();

   router.get('/books',        bookController.get);
   router.get('/books/:id',    bookController.getById);
   router.post('/books',       bookController.create);
   router.put('/books/:id',    bookController.updateById);
   router.delete('/books/:id', bookController.deleteById);

   module.exports = router;
   ```

3. **Run & enjoy**  
   - `GET  /books`        → paginated list  
   - `GET  /books/:id`    → single book  
   - `POST /books`        → create new  
   - `PUT  /books/:id`    → update by ID  
   - `DELETE /books/:id`  → delete by ID  

That’s it—CRUD up and running in under 10 lines of code!

---

## Express Route Setup

```js
const express = require('express');
const router  = express.Router();
const userController = new BaseController(UserModel, userConfig);

router
  .get('/users',           userController.get)
  .get('/users/all',       userController.getAll)    // all records, no pagination
  .get('/users/:id',       userController.getById)
  .post('/users',          userController.create)
  .put('/users/:id',       userController.updateById)
  .delete('/users/:id',    userController.deleteById);
```

---

## Configuration Options

When you call `new BaseController(Model, config)`, you can override defaults for each operation:

```js
{
  name: 'EntityName',         // used in response messages
  access: 'admin' | 'user',   // scope operations
  accessKey: 'ownerId',       // field to match req.user._id

  get: { … },                 // GET /
  getById: { … },             // GET /:id
  create: { … },              // POST /
  updateById: { … },          // PUT /:id
  deleteById: { … },          // DELETE /:id
  getAll: { … },              // GET /all
}
```

Each operation’s config can include:

| Option      | Type                 | Description                                                                                                |
|-------------|----------------------|------------------------------------------------------------------------------------------------------------|
| `select`    | String               | Mongoose select string (e.g. `'-password'`)                                                                |
| `populate`  | Array<String|Object> | Paths or mongoose populate objects                                                                           |
| `query`     | Array<String>        | Allowed query-string filters (`?status=active`)                                                            |
| `params`    | Array<String>        | Allowed route-param filters (`/:orgId`)                                                                     |
| `pagination`| `{ limit, maxLimit }`| Default & maximum page size (only under `get`)                                                             |
| `pre`       | `async fn(...)`      | Function to run before DB operation (modify filter/payload)                                                |
| `post`      | `async fn(...)`      | Function to run after DB operation (modify result)                                                         |

---

## Feature Deep Dive

### 5.1 Filtering & Query Params

- **Route params** (`config.get.params`):  
  ```js
  params: ['orgId']
  // GET /items/123 → filter { orgId: 123 }
  ```

- **Query strings** (`config.get.query`):  
  ```js
  query: ['status','type']
  // GET /items?status=active&type=premium → { status:'active', type:'premium' }
  ```

- **Text search**:  
  ```js
  // MongoDB: ensure this index on your schema
  MySchema.index({ title: 'text', description: 'text' });

  // GET /items?search=keyword
  // Applies {$text: {$search:'keyword'}}
  ```

---

### 5.2 Pagination

By default, `get()` enforces:

```js
config.get.pagination = {
  limit:    10,    // default per-page
  maxLimit: 100    // maximum allowed
}
```

- `?limit=5&page=2` → skip 5, limit 5  
- Out-of-bounds `limit` is clamped to `maxLimit`

---

### 5.3 Access Control

| `config.access` | Behavior                                                                                 |
|-----------------|------------------------------------------------------------------------------------------|
| `admin`         | No user-scoped restriction (anyone with route access can operate)                        |
| `user`          | All ops add filter `{ accessKey: req.user._id }`; user must be logged in and `req.user` set |

```js
new BaseController(Task, {
  access: 'user',
  accessKey: 'ownerId'
});
```

---

### 5.4 Field Selection & Population

```js
select: '-password -__v',
populate: [
  'profile', 
  { path: 'organization', select: 'name address' }
]
```

- `.select(select)`
- `.populate(populate)`

---

### 5.5 Full-Text Search

```js
// In your Mongoose schema
Schema.index({ title:'text', content:'text' });

// In config.get:
searchEnabled: true
// Or simply call GET /?search=some-term
```

When `search` is present:
- Sort by text score: `{ score: { $meta: "textScore" } }`
- Project score: `.select({ score: { $meta: "textScore" } })`

---

### 5.6 Pre/Post Hooks

- **Pre-hook**: run before the DB call, can mutate filter or payload  
  ```js
  pre: async (filterOrPayload, req) => {
    // Example: only active items
    filterOrPayload.active = true;
    return filterOrPayload;
  }
  ```

- **Post-hook**: run after data is retrieved or modified  
  ```js
  post: async (result, req) => {
    // Example: remove sensitive fields
    if (Array.isArray(result)) {
      result.forEach(r => delete r.secretToken);
    } else {
      delete result.secretToken;
    }
    return result;
  }
  ```

---

### 5.7 `getAll` (No Pagination)

Use `getAll()` when you need the full list:

```js
getAll: {
  select: 'name email',
  populate: ['organization']
}
```

- Route: `GET /items/all`
- Returns **all** documents, sorted by `createdAt: -1`

---

## Full Example (All Features)

```js
const BaseController = require('./BaseController');
const Order = require('./models/Order');

const orderController = new BaseController(Order, {
  name: 'Order',
  access: 'user',
  accessKey: 'customerId',

  get: {
    select: '-__v',
    populate: ['items.product', { path:'customer', select:'name email' }],
    query: ['status','paymentMethod'],
    params: ['storeId'],
    pagination: { limit: 20, maxLimit: 100 },
    pre: async (filter, req) => {
      // only in-progress orders
      filter.status = { $ne: 'cancelled' };
    },
    post: async (data, req) => {
      // mark expensive orders
      return data.map(o => ({
        ...o.toObject(),
        isHighValue: o.total > 1000
      }));
    }
  },

  getById: {
    select: '-__v',
    populate: ['items.product', 'customer']
  },

  create: {
    pre: async (payload, req) => {
      payload.createdAt = new Date();
      return payload;
    },
    post: async (doc, req) => {
      // send confirmation email
      await emailService.sendOrderConfirmation(doc);
      return doc;
    }
  },

  updateById: {
    pre: async (filter, updatePayload, req) => {
      // only allow status change
      return { filter, updatePayload: { status: updatePayload.status } };
    }
  },

  deleteById: {
    pre: async (filter, req) => {
      // prevent deletion of shipped orders
      filter.status = { $ne: 'shipped' };
      return filter;
    }
  },

  getAll: {
    select: 'orderNumber status total',
    populate: []
  }
});

// Express wiring
const router = require('express').Router();
router
  .get('/orders',        orderController.get)
  .get('/orders/all',    orderController.getAll)
  .get('/orders/:id',    orderController.getById)
  .post('/orders',       orderController.create)
  .put('/orders/:id',    orderController.updateById)
  .delete('/orders/:id', orderController.deleteById);

module.exports = router;
```

---

## Best Practices & Tips

- **Authenticate & attach** `req.user` before these routes (e.g. JWT, Passport).  
- **Validate inputs** with middleware (Joi, express-validator) to keep controllers lean.  
- **Use text indexes** for search: `Model.schema.index({ ... })`.  
- **Leverage hooks** for side-effects (emails, audits, logs).  
- **Clamp pagination** via `maxLimit` to prevent abuse.
# hemProjectBaseControllerNodejs
# hemLeatherSkillManagement

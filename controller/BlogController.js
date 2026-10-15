const BaseController = require('../core/BaseController');
const Blog = require('../models/Blog');
const config = require('../config');

const blogController = new BaseController(Blog, {
  name: 'blog',
  access: 'admin',
  get: {
    pagination: config.pagination,
    query: ["slug", "type", "trending"]
  },
});

module.exports = blogController;

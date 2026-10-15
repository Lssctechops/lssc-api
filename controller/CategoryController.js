const BaseController = require('../core/BaseController');
const Category = require('../models/Category');
const config = require('../config');

const categoryController = new BaseController(Category, {
  name: 'category',
  access: 'admin',
  get: {
    sort:{priority: 1},
    pagination: config.pagination,
  },
});

module.exports = categoryController;

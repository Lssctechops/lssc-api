const BaseController = require('../core/BaseController');
const NewsLetter = require('../models/NewsLetter');
const config = require('../config');

const newsLetterController = new BaseController(NewsLetter, {
  name: 'newsLetter',
  access: 'Admin',
  get: {
    pagination: config.pagination,
    query: ['type'],
  },
});

module.exports = newsLetterController;

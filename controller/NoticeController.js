const BaseController = require('../core/BaseController');
const Notice = require('../models/Notice');
const config = require('../config');

const noticeController = new BaseController(Notice, {
  name: 'notice',
  access: 'Admin',
  get: {
    pagination: config.pagination,
    query: ['type'],
  },
});

module.exports = noticeController;

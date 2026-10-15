const BaseController = require('../core/BaseController');
const Banner = require('../models/Banner');
const config = require('../config');

const bannerController = new BaseController(Banner, {
  name: 'banner',
  access: 'admin',
  get: {
    sort: { priority: 1 },
    pagination: config.pagination,
  },
});

module.exports = bannerController;

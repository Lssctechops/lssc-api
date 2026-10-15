const BaseController = require('../core/BaseController');
const Gallery = require('../models/Gallery');
const config = require('../config');

const galleryController = new BaseController(Gallery, {
  name: 'gallery',
  access: 'Admin',
  get: {
    pagination: config.pagination,
  },
});

module.exports = galleryController;

const BaseController = require('../core/BaseController');
const ResourcePdf = require('../models/ResourcePdf');
const config = require('../config');

const resourcePdfController = new BaseController(ResourcePdf, {
  name: 'resourcePdf',
  access: 'Admin',
  get: {
    pagination: config.pagination,
    query:["category"]
  },
});

module.exports = resourcePdfController;

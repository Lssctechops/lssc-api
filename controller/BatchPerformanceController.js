const BaseController = require('../core/BaseController');
const BatchPerformance = require('../models/BatchPerformance');
const config = require('../config');

const batchPerformanceController = new BaseController(BatchPerformance, {
  name: 'batchPerformance',
  access: 'user',
  accessKey:'trainer',
  get: {
    pagination: config.pagination,
    populate: [{ path: 'trainer' }]
  },
});

module.exports = batchPerformanceController;

const BaseController = require('../core/BaseController');
const Batch = require('../models/Batch');
const config = require('../config');

const batchController = new BaseController(Batch, {
  name: 'batch',
  access: 'user',
  accessKey:'trainer',
  get: {
    pagination: config.pagination,
    populate: [{ path: 'trainer', select: 'name email'},{ path: 'course', select: 'title thumbnail'} ],
  },
});

module.exports = batchController;

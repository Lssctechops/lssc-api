const BaseController = require('../core/BaseController');
const Batch = require('../models/Batch');
const config = require('../config');

const batchAssessorController = new BaseController(Batch, {
  name: 'batch',
//   access: 'user',
//   accessKey:'trainer',
  get: {
    pagination: config.pagination,
    populate: [{ path: 'trainer', select: 'name email'},{ path: 'course', select: 'title thumbnail'} ],
  },
});

module.exports = batchAssessorController;

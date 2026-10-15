const BaseController = require('../core/BaseController');
const BatchAssessment = require('../models/BatchAssessment');
const config = require('../config');

const batchAssessmentController = new BaseController(BatchAssessment, {
  name: 'batchAssessment',
  access: 'user',
  accessKey: 'assessor',
  get: {
    pagination: config.pagination,
    populate: [
      { path: 'batchId' },
      {path: 'assessor', select: 'name email employeeId mobile avatar' } 
    ]
  },
  getById: {
    populate: [
      { path: 'batchId' },
      {path: 'assessor', select: 'name email employeeId mobile avatar' } 
    ]
  },
});

const batchAdminAssessmentController = new BaseController(BatchAssessment, {
  name: 'batchAssessment',
  // access: 'user',
  // accessKey: 'assessor',
  get: {
    pagination: config.pagination,
    populate: [
      { path: 'batchId' },
      {path: 'assessor', select: 'name email employeeId mobile avatar' } 
    ]
  },
  getById: {
    populate: [
      { path: 'batchId' },
      {path: 'assessor', select: 'name email employeeId mobile avatar' } 
    ]
  },
});

module.exports = {batchAssessmentController, batchAdminAssessmentController};

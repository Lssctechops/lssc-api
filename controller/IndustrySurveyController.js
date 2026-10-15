const BaseController = require('../core/BaseController');
const IndustrySurvey = require('../models/IndustrySurvey');
const config = require('../config');

const industrySurveyController = new BaseController(IndustrySurvey, {
  name: 'industrySurvey',
  access: 'User',
  get: {
    pagination: config.pagination,
  },
});

module.exports = industrySurveyController;

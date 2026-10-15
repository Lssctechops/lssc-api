const BaseController = require('../core/BaseController');
const CourseSegment = require('../models/CourseSegment');
const config = require('../config');

const courseSegmentController = new BaseController(CourseSegment, {
  name: 'courseSegment',
  access: 'admin',
  get: {
    sort:{priority:-1},
    pagination: config.pagination,
  },
});

module.exports = courseSegmentController;

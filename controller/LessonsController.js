const BaseController = require('../core/BaseController');
const Lessons = require('../models/Lesson');
const config = require('../config');

const lessonsController = new BaseController(Lessons, {
    name: 'Lessons',
    access: 'Admin',
    get: {
        pagination: config.pagination,
        param:['course']
    },
});

module.exports = lessonsController;

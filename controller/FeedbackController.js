const BaseController = require('../core/BaseController');
const Feedback = require('../models/Feedback');
const config = require('../config');

const feedbackController = new BaseController(Feedback, {
    name: 'Feedback',
    access: 'Admin',
    get: {
        pagination: config.pagination,
        populate: [{ path: 'user', select: 'name email'},{ path: 'course', select: 'title thumbnail'} ],
    },
});

// for user  req.user._id
const feedbackcustomerController = new BaseController(Feedback, {
    name: 'Feedback',
    access: 'User',
    // accessKey:'user',
    get: {
        pagination: config.pagination,
        populate: [{ path: 'user', select: 'name email'},{ path: 'course', select: 'title thumbnail'} ],
    },
});


module.exports = {feedbackController,feedbackcustomerController};

const BaseController = require('../core/BaseController');
const Order = require('../models/Order');
const config = require('../config');

const userOrderController = new BaseController(Order, {
    name: 'UserOrder',
    access: 'User',
    accessKey:'User',
    get: {
        pagination: config.pagination,
        query: ['status'],
        select:'-user',
        populate: [{path:'course', select:'thumbnail price title rating'}]
    },
});

module.exports = userOrderController;
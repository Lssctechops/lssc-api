const BaseController = require('../core/BaseController');
const User = require('../models/User');
const config = require('../config');

const userController = new BaseController(User, {
    name: 'User',
    access: 'admin',
    get: {
        pagination: config.pagination,
        select: 'avatar name email mobile status role createdAt isApproved isVerified locationId employeeId',
        query: ['status', 'role', 'email', 'mobile', 'isApproved'],
        populate: [{path:"locationId"}]
    }
});

// // Dashboard stats: total users, total courses, live courses, total purchases
userController.getDashboardStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const Batch = require('../models/Batch');
        const BatchAssessment = require('../models/BatchAssessment');
        const totalTrainers = await User.countDocuments({role: 'trainer'});
        const totalAssessors = await User.countDocuments({role: 'assessor'});
        const totalBatches = await Batch.countDocuments();
        const totalAssessments = await BatchAssessment.countDocuments();

        return res.status(200).json({ totalTrainers, totalAssessors, totalBatches, totalAssessments });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// // All users with their purchases (username, email, phone, buying courses)
// userController.getUsersWithPurchases = async (req, res) => {
//     try {
//         const User = require('../models/User');
//         const Order = require('../models/Order');
//         const Course = require('../models/Course');
//         const users = await User.find({}, 'name email mobile').lean();
//         const orders = await Order.find({}).populate('course', 'title').lean();
//         const userMap = {};
//         users.forEach(u => userMap[u._id.toString()] = { ...u, buyingCourses: [] });
//         orders.forEach(o => {
//             if (userMap[o.user.toString()]) {
//                 userMap[o.user.toString()].buyingCourses.push(o.course ? o.course.title : null);
//             }
//         });
//         return res.status(200).json(Object.values(userMap));
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// // Users with their purchased courses (username, and array of course names)
// userController.getUsersWithCourseNames = async (req, res) => {
//     try {
//         const User = require('../models/User');
//         const Order = require('../models/Order');
//         const Course = require('../models/Course');
//         require('../models/Lesson'); // Ensure Lesson model is registered

//         // Get all users
//         const users = await User.find({}, 'name').lean();

//         // Get all orders with course populated
//         const orders = await Order.find({})
//             .populate('course', 'title')
//             .lean();

//         // Map userId to purchased course names
//         const userCourseMap = {};
//         users.forEach(u => userCourseMap[u._id.toString()] = { username: u.name, courses: [] });
//         orders.forEach(o => {
//             if (userCourseMap[o.user.toString()] && o.course) {
//                 userCourseMap[o.user.toString()].courses.push(o.course.title);
//             }
//         });

//         return res.status(200).json(Object.values(userCourseMap));
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

module.exports = userController;

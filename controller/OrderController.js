const BaseController = require('../core/BaseController');
const Order = require('../models/Order');
const config = require('../config');

const orderController = new BaseController(Order, {
    name: 'Order',
    access: 'Admin',
    get: {
        pagination: config.pagination,
        query:['user','course'],
        populate:[{path:'user'}]
    },
});

const ordercustomerController = new BaseController(Order, {
    name: 'Order',
    access: 'User',
    get: {
        pagination: config.pagination,
        query:['user','course'],
        populate:[{path:'user'}]
    },
});

// // Custom method to get user purchase summary
// orderController.getUserPurchaseSummary = async (req, res) => {
//   try {
//     const summary = await Order.aggregate([
//       {
//         $group: {
//           _id: '$user',
//           totalPurchases: { $sum: 1 },
//         },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'userDetails',
//         },
//       },
//       { $unwind: '$userDetails' },
//       {
//         $project: {
//           _id: 0,
//           name: '$userDetails.name',
//           email: '$userDetails.email',
//           phone: '$userDetails.mobile',
//           totalPurchases: 1,
//         },
//       },
//     ]);

//     res.status(200).json(summary);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // All payments history (user name, course name, transaction date, amount, paymentId, orderId)
// orderController.getPaymentsHistory = async (req, res) => {
//     try {
//         const orders = await Order.find({ status: 'Completed' })
//             .populate('user', 'name')
//             .populate('course', 'title')
//             .lean();

//         function formatDate(date) {
//             const d = new Date(date);
//             return d.toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             });
//         }

//         const result = orders.map(o => ({
//             userName: o.user && o.user.name ? o.user.name : '',
//             courseName: o.course && o.course.title ? o.course.title : '',
//             transactionDate: formatDate(o.createdAt),
//             amount: (o.price ? o.price + ' INR' : ''),
//             paymentId: o.paymentId || '',
//             orderId: o.orderId || ''
//         }));
//         return res.status(200).json(result);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// orderController.create = async function (req, res) {
//     try {
//         const data = req.body;
//         data.user = req.user.id;
//         data.course = data.course || data.courseId;

//         if (!data.course) {
//             return res.status(400).json({ message: "Course ID is required" });
//         }

//         const existingOrder = await Order.findOne({ user: data.user, course: data.course });
//         if (existingOrder) {
//             return res.status(400).json({ message: "You have already purchased this course." });
//         }

//         const order = new Order(data);
//         await order.save();
//         return res.status(201).json({ message: "Order created successfully", data: order });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message, message: "Error in server" });
//     }
// };

module.exports = {orderController ,ordercustomerController};

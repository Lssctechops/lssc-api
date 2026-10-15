const BaseController = require('../core/BaseController');
const Course = require('../models/Course');
const config = require('../config');
const slugify = require('slugify');

const courseController = new BaseController(Course, {
  name: 'Course',
  access: 'admin',
  get: {

    sort: { priority: 1 },
    pagination: config.pagination, // pagination only for get 
    query: ["type", "level", "access", "featured", "rating", "scheme", "duration"], // for filter 
    populate: [
      { path: "category", select: "title" },
      { path: "courseSegment", select: "title" },
    ],
    pre: async (filter, req) => {
      // Custom multi-select handling for category
      if (req.query.category) {
        const ids = req.query.category.split(",").map((id) => id.trim());
        filter.category = { $in: ids };
      }

      // If you also want multi-select for courseSegment
      if (req.query.courseSegment) {
        const ids = req.query.courseSegment.split(",").map((id) => id.trim());
        filter.courseSegment = { $in: ids };
      }
    },
  },
  getById: {
    populate: [{ path: "category", select: "title" }, { path: "courseSegment", select: "title" }],
  },
  create: {
    pre: async (payload, req) => {
      if (!payload.title) throw new Error('Title is required to generate slug');
      payload.slug = slugify(payload.title, { lower: true, strict: true });
      return payload;
    }
  }
});

// // All courses with details (thumbnail, category, course name, ratings, time, price)
// courseController.getAllCoursesWithDetails = async (req, res) => {
//     try {
//         const Course = require('../models/Course');
//         const Feedback = require('../models/Feedback');
//         const courses = await Course.find({})
//             .populate('category', 'name')
//             .populate('lessons')
//             .lean();

//         const feedbacks = await Feedback.aggregate([
//             { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
//         ]);
//         const ratingMap = {};
//         feedbacks.forEach(f => ratingMap[f._id.toString()] = { avgRating: f.avgRating, count: f.count });

//         const result = courses.map(c => ({
//             id: c._id,
//             thumbnail: c.thumbnail || '',
//             category: c.category ? { id: c.category._id, name: c.category.name } : null,
//             courseName: c.title,
//             ratings: ratingMap[c._id.toString()] ? ratingMap[c._id.toString()].avgRating : null,
//             ratingCount: ratingMap[c._id.toString()] ? ratingMap[c._id.toString()].count : 0,
//             duration: c.totalHours,
//             price: c.price
//         }));

//         return res.status(200).json(result);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

module.exports = courseController;

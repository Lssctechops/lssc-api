const mongoose = require('mongoose');
/**
 * Feedback Schema
 * This schema defines the structure for a feedback document in MongoDB.
 * It includes fields for user, course, rating, comment, and timestamps.
 */

const FeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    visiblity:{type:Boolean,default:true}
}, { timestamps: true });

// FeedbackSchema.index({ user: 1, course: 1 });
FeedbackSchema.index({ comment: 1 }); // Add index on course for efficient course feedback queries

module.exports = mongoose.model('Feedback', FeedbackSchema);

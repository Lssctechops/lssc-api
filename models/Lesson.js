const mongoose = require('mongoose');
/**
 * Lesson Schema
 * This schema defines the structure for a lesson document in MongoDB.
 * It includes fields for title, content, videoUrl, duration, course reference, and resources.
 */

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    duration: { type: Number }, // in minutes
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    resourse:[{type:String}],
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);

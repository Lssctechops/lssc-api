const mongoose = require('mongoose');
/**
 * CourseSegment Schema
 * This schema defines the structure for a CourseSegment document in MongoDB.
 * It includes fields for name, thumbnail, publicId, description, and timestamps.
 */

const CourseSegmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: Number, default: 0 }, // For sorting courses
    // Add other fields as needed
  },
  { timestamps: true }
);

// Add a compound index for 'name' and 'thumbnail' fields
CourseSegmentSchema.index({ title: 1, description: 1 });

// Create the model
const CourseSegment = mongoose.models.CourseSegment || mongoose.model('CourseSegment', CourseSegmentSchema);

module.exports = CourseSegment;

const mongoose = require('mongoose');
/**
 * Category Schema
 * This schema defines the structure for a category document in MongoDB.
 * It includes fields for name, thumbnail, publicId, description, and timestamps.
 */

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: Number, default: 0 }, // For sorting courses
    // Add other fields as needed
  },
  { timestamps: true }
);

// Add a compound index for 'name' and 'thumbnail' fields
CategorySchema.index({ title: 1, description: 1 });

// Create the model
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

module.exports = Category;

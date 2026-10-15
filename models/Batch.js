const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map'
    },
    center:{
      type: String
    },
    scheme: { type: String},
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    certified: { type: String },
    duration: { type: String },
    successfullyPlaced: { type: Number, default: 0 },
    strength: { type: Number, min: 1, required: true },
    startAt: { type: Date, default: Date.now },
    endAt: { type: Date },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    priority: { type: Number, default: 0 }, // For sorting courses
}, { timestamps: true });

// Indexing for search functionality
BatchSchema.index({ name: 'text', trainer: 1 });

module.exports = mongoose.model('Batch', BatchSchema);

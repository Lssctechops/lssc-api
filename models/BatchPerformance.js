const mongoose = require('mongoose');

const BatchPerformanceSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true    
  },
  center:{
    type: String
  },
  trainingToday: {
    type: Boolean
  },
  timeOfReporting: {
    type: String
  },
  sessionTime: {
    type: String
  },
  trainingDuration:{
    type: String
  },
  totalBatchStrength: {
    type: Number
  },
  noOfStudentsAttended: {
    type: Number
  },
  practicalSkillRating: {
    type: Number, // out of 5
    min: 1,
    max: 5
  },
  theoryUnderstandingRating: {
    type: Number, // out of 5
    min: 1,
    max: 5
  },
  behavioralFeedback: {
    type: String
  },
  assessmentToday: {
    type: Boolean
  },
  overallPassStatus: {
    type: String,
    enum: ['Pass', 'Fail']
  },
  avgScoreTheory: { type: Number }, // Average score of the batch, e.g., 85
  avgScorePractical: { type: Number }, // Average score of the batch, e.g., 85
  certificationStatus: {
    type: Number, // Number of students certified
  },
  city:{
    type: String
  },
  district: {
    type: String
  },
  state: {
    type: String
  },
  generalObservation: {
    type: String,
  },
  traineeParticipation: {
    type: String, 
  },
  disciplineAndGrooming:{
    type: String, 
  },
  reportDocument: {
    type: String, // URL or path to the report document
  },
  document: { type: String, required: true },
  location: { type: String },
}, {
  timestamps: true
});
// Indexing for search functionality
BatchPerformanceSchema.index({ batchId: 1, trainer: 1});

module.exports = mongoose.model('BatchPerformance', BatchPerformanceSchema);

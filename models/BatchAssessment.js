const mongoose = require('mongoose');

const BatchAssessmentSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  assessor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentDate: {
    type: Date
  },
  assessmentType: {
    type: String,
    enum: ['Theory', 'Practical']
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Map'
  },
  district: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  timeOfReporting: {
    type: String
  },
  assessmentTime: {
    type: String
  },
  totalCandidatesAppeared: {
    type: Number
  },
  candidatesPassed: {
    type: Number
  },
  avgScoreTheory: { type: Number },
  avgScorePractical: { type: Number },
  avgScoreViva: { type: Number },
  reportDocument: {
    type: String
  },
  totalBatchStrength: {
    type: Number
  },
  remarks: {
    type: String
  },
  day: {
    type: Number
  },
  modeOfAssessment: {
    type: String,
    enum: ['Online', 'Onsite', 'Hybrid'],
    required: true
  },
  trainingPartner: {
    type: String
  },
  centre: {
    type: String
  },

  // ✅ Newly added fields
  jobRole: { type: String },
  totalSessionTime: { type: String },
  assessmentCountToday: { type: Number },
  practicalTestCount: { type: Number },
  practicalTestPassed: { type: Number },
  practicalGrade: { type: String },
  vivaCount: { type: Number },
  vivaPassed: { type: Number },
  vivaGrade: { type: String },
  writtenTestCount: { type: Number },
  writtenTestPassed: { type: Number },
  writtenTestGrade: { type: String },
  softSkillsCount: { type: Number },
  softSkillsGrade: { type: String }

}, {
  timestamps: true
});

BatchAssessmentSchema.index({ batchId: 1, assessor: 1, assessorName: 1, assessmentType: 1, location: 1 });

module.exports = mongoose.model('BatchAssessment', BatchAssessmentSchema);

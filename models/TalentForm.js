const mongoose = require('mongoose');

const TalentFormSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  quickHiring: {
    type: Boolean,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  segment: [{
    type: String
  }],
  jobRole: [{
    type: String
  }],
  numberOfCandidates: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Any'],
    required: true,
  },
  age: {
    type: String, // kept as string for flexible inputs like "18+" or "18-25"
    required: false,
  },
  disabilityPreference: {
    type: Boolean,
    required: true,
  },
  certification: {
    type: String,
    required: false,
  },
  qualification: [{
    type: String,
    required: false,
  }],

  totalWorkforce: {
    type: String,
    required: true,
  },

  nsqfAligned: {
    type: Boolean,
  },
  governmentInitiativeParticipation: {
    type: Boolean
  },

  offerToTrainer: {
    type: Boolean
  },

  offerToAssessor: {
    type: Boolean
  },

  supportCurriculumDevelopment: {
    type: Boolean
  },

  supportIndustryExposure: {
    type: Boolean
  },
  status: { type: String, enum: ['open', 'close'], default: 'open' },
  supportRealTimeAssessment: {
    type: Boolean
  },
  letterOfIntent: {
    type: String
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TalentForm', TalentFormSchema);

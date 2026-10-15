const mongoose = require('mongoose');

const IndustrySurveySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  companyProfile: {
    type: String,
    required: false
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  address: {
    type: String,
    required: false
  },
  personFillingForm: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: false
  },
  totalWorkforce: {
    type: String, // could be number, but kept string for formats like "100 (permanent, contract)"
    required: false
  },
  awareOfSchemes: {
    type: String,
    enum: ['Yes', 'No'],
    required: false
  },
  attendedTrainingProgram: {
    type: String,
    enum: ['Yes', 'No'],
    required: false
  },
  trainingProgramName: {
    type: String,
    required: false
  },
  interestedSchemes: {
    type: String,
    required: false
  },
  attritionRatio: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IndustrySurvey', IndustrySurveySchema);

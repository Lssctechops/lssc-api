const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  avatar: {
    type: String
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
  },
  dateOfBirth: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  category: {
    type: String,
  },
  gender: {
    type: String,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['admin','assessor','trainer','user','subadmin'],
      message: 'Role must be either Admin or Assessor or Trainer or User'
    },
    required: true
  },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  token: {
    type: String
  },
  otp: [{
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  isApproved: {
    type: Boolean,
    default:false
  },
  locationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Map' }],
  dateOfJoining: {
    type: Date
  },
  employeeId: {
    type: String,
    required: false,
    unique: true
  },
  specialization: {
    type: String,
    trim: true
  },
  aadhaar: {
    type: String,
  },
  pan: {
    type: String,
  },
  bank: {
    type: String,
  },
  passbook: {
    type: String,
  },
}, { timestamps: true });

UserSchema.index({ name: 'text', email: 'text' });

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
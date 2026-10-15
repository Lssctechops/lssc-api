const mongoose = require("mongoose");

const CandidateRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  personalDetails: {
    jobLocation: [{
      type: String,
      trim: true
    }],
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    pinCode: {
      type: String,
      required: [true, "Pin code is required"],
      match: [/^\d{6}$/, "Pin code must be a 6-digit number"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Enter a valid email address",
      ],
    },
  },
  educationDetails: {
    qualification: {
      type: String,
    },
    university: {
      type: String,
    },
    specialization: {
      type: String,
    },
    passingYear: {
      type: Number,
      min: [1950, "Year must be after 1950"],
    },
    grade: {
      type: String,
    },
    resumeUrl: {
      type: String,
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v),
        message: "Invalid resume URL",
      },
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("CandidateRegistration", CandidateRegistrationSchema);

const mongoose = require("mongoose");
/**
 * TeamMember Schema
 * Members shown in the "Meet Our Team" section of the website.
 */
const TeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    designation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    thumbnail: {
      url: {
        type: String,
        required: true,
        validate: {
          validator: (v) => /^https?:\/\/.+/.test(v),
          message: "Invalid thumbnail URL format",
        },
      },
      publicId: {
        type: String,
      },
    },
    position: {
      type: Number,
      default: 0, // lower appears first
    },
    isCeo: {
      type: Boolean,
      default: false, // featured card at the top
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ name: "text", designation: "text" });

module.exports =
  mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMemberSchema);
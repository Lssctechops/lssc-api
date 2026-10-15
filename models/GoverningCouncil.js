const mongoose = require("mongoose");
/**
 * GoverningCouncil Schema
 * Members shown in the Governing Council section of the website.
 */
const GoverningCouncilSchema = new mongoose.Schema(
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
    company: {
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
      default: 0, // lower appears first in the slider
    },
    isChairman: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, // shown on website
    },
  },
  { timestamps: true }
);

GoverningCouncilSchema.index({ name: "text", company: "text" });

module.exports =
  mongoose.models.GoverningCouncil ||
  mongoose.model("GoverningCouncil", GoverningCouncilSchema);
const mongoose = require("mongoose");
/**
 * Notice Schema
 * This schema defines the structure for a notice document in MongoDB.
 * It includes fields for type, thumbnail, title, content, hyperlink, and timestamps.
 */
const NoticeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["notice", "event", "trainer", "assessor"],
      required: true,
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
        required: true
      }
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    content: {
      type: String,
      required: true,
      minlength: 5,
    },
    hyperLink: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }
);

NoticeSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model("Notice", NoticeSchema);

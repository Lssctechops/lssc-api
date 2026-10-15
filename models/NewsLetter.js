const mongoose = require("mongoose");
const NewsLetterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["subscriber", "user"],
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
    subject: {
      type: String,
      required: true,
      minlength: 5,
    },
    message: {
      type: String,
      required: true,
      minlength: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);
// Indexing for search functionality
NewsLetterSchema.index({ subject: 'text', message: 'text' });
module.exports = mongoose.model("NewsLetter", NewsLetterSchema);

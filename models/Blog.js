const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ["blog", "news", "service", "event","media","industry","faqs","informative"],
        message: "Type must be one of: blog, news, service, or event",
      },
      required: [true, "Type is required"],
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, "Thumbnail URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Thumbnail publicId is required"],
      },
      alt: {
        type: String,
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true, // handled at DB level, not always enforced by Mongoose validation
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    hyperLink: {
      type: String,
    },
    seo: {
      metaTitle: {
        type: String,
      },
      metaDescription: {
        type: String,
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
      jsonLdSchema: {
        type: Object,
        default: {}
      },
    },
    author: {
      name: {
        type: String
      },
      designation: {
        type: String
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
    trending: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0, // For sorting blogs
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ title: 'text', shortDescription: 'text', content: 'text' });

module.exports = mongoose.model("Blog", BlogSchema);

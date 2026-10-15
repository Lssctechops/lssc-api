const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Course title is required.'] },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category model
    courseSegment: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSegment', required: true },
    price: { type: Number, required: [true, 'Course price is required.'] },
    scheme: {
      type: String,
      enum: [
        'pmkvy-pradhan-mantri-kaushal-vikas-yojana',
        'pm-vishwakarma-yojana',
        'state-skill-development-missions-ssdm',
        'national-apprenticeship'
      ],
      required: false
    },
    totalHours: { type: Number },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    access: { type: String, enum: ['lifetime', 'limited'], default: 'lifetime' },
    duration: { type: String, enum: ['short', 'long'], default: 'short' },
    mode: { type: String, enum: ['online', 'offline', 'live'], default: 'online' },
    // devices: [{ type: String, enum: ['mobile', 'desktop', 'tv'] }],
    // lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    rating: { type: Number ,default:0},
    thumbnail: {
      url: {
        type: String,
        required: [true, "Thumbnail URL is required"],
        validate: {
          validator: (v) => /^https?:\/\/.+/.test(v),
          message: "Invalid thumbnail URL format",
        },
      },
      publicId: {
        type: String,
        required: [true, "Thumbnail publicId is required"],
      },
      alt: {
        type: String,
      },
    },
    qp_code: { type: String },
    qp_link: { type: String },
    curriculam_link: { type: String },
    nsqf_level: { type: String },
    version_no: { type: String },
    featured:{type:Boolean,default:false},
    priority: { type: Number, default: 0 }, // For sorting courses
}, { timestamps: true });

CourseSchema.index({ title: 1, description: 1 }); // for regular queries
CourseSchema.index({ title: 'text', description: 'text' }); // for $text search


module.exports = mongoose.model('Course', CourseSchema);

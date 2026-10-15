const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String, // Image access URL (CDN or direct)
    image:String,
    providerId: String, // Image ID from provider like Cloudflare or Cloudinary
    name: String, // Original file name
    alt: String,
    public: { type: Boolean, default: false },
    publicId: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Pre-save hook to assign providerId to publicId if not already set
ImageSchema.pre('save', function (next) {
    if (this.providerId) {
        this.publicId = this.providerId;
    }
    if (this.url) {
        this.image = this.url;
    }
    next();
});

module.exports = mongoose.model('Image', ImageSchema);

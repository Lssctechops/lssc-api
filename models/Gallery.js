const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true,
        unique: true
    },
    alt: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Gallery", GallerySchema);

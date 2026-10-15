const mongoose = require("mongoose");

const CoordinatesSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false }
);

const MapSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["training", "event", "other"],
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
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    coordinates: {
      type: CoordinatesSchema,
      required: true,
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
    priority: { type: Number, default: 0 }, // For sorting courses
  },
  { timestamps: true }
);

// Properly define the geospatial index
MapSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("Map", MapSchema);

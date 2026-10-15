// routes/image.js
const express = require('express');
const ImageModel = require('../models/Image');
const ImageCloudinaryController = require('../core/ImageCloudinaryController');
const authController  =  require("../controller/auth");
const config = require('../config');

const router = express.Router();

const imageUploadController = new ImageCloudinaryController(ImageModel, {
  cloudinary: {
    cloudName: config.cloudinary.cloudName, // Ensure these environment variables are set
    apiKey: config.cloudinary.apiKey,
    apiSecret: config.cloudinary.apiSecret
  },
  quality: {
    cloudinaryQuality: 'auto' // Let Cloudinary optimize further
  },
  rootAccessRoles: ['admin'], // Optional
  pagination: config.pagination
});



router.post('/', imageUploadController.uploadImage);
router.delete('/:id', imageUploadController.deleteFromCloudinary);
router.get('/',authController.authenticateToken, imageUploadController.getImages);

module.exports = router;

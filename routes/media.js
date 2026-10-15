
const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const ImageCloudflareController = require("../core/ImageCloudflareController");
const BaseController = require("../core/BaseController");
const config = require('../config');
const authController  =  require("../controller/auth");


const mediaController = new ImageCloudflareController(Image, {
    cloudflare: config.cloudflareImage,
    rootAccessRoles: ["admin"],
    pagination: config.pagination
});

const publicImageController = new BaseController(Image, {
    access: 'admin',
    get: {
        pagination: config.pagination,
        pre:(filter,req,res)=>{
            filter.public = true;
        },
        sort: { createdAt: -1 }
    }
});

const privateImageController = new BaseController(Image, {
    access: 'user',
    accessKey: 'createdBy',
    get: {
        pagination: config.pagination,
        sort: { createdAt: -1 }
    }
});


router.post('/' ,mediaController.uploadImage);
router.get('/public', publicImageController.get);


router.use(authController.authenticateToken);

router.use(authController.authorizeRole('admin')); 

router.delete('/:id', mediaController.deleteImage);
router.get('/', privateImageController.get);
router.get('/all', publicImageController.getAll);
router.put('/:id',  publicImageController.updateById);



module.exports = router;
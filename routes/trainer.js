const express = require('express');
const router = express.Router();
// const { authenticateJWT } = require('../services/AuthController');
const UserController = require('../controller/UserController');
const batchController = require('../controller/BatchController');
const authController  =  require("../controller/auth");
const batchPerformanceController = require('../controller/BatchPerformanceController');
const reportController = require('../controller/ReportController');
const noticeController = require('../controller/NoticeController');

// Protect all routes below this line
router.use(authController.authenticateToken);   
router.use(authController.authorizeRole('trainer')); 

// Batch CRUD
router.get('/batch', batchController.get); // add pagination
router.get('/batch/:id', batchController.getById);
router.post('/batch',  batchController.create);
router.put('/batch/:id',  batchController.updateById);
router.delete('/batch/:id',  batchController.deleteById);

// Batch CRUD
router.get('/batchPerformance', batchPerformanceController.get); // add pagination
router.get('/batchPerformance/:id', batchPerformanceController.getById);
router.post('/batchPerformance',  batchPerformanceController.create);
router.put('/batchPerformance/:id',  batchPerformanceController.updateById);
router.delete('/batchPerformance/:id',  batchPerformanceController.deleteById);

// User CRUD
router.get('/users', UserController.get);
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.updateById);
router.delete('/users/:id', UserController.deleteById);

// Notice CRUD
router.get('/notice', noticeController.get); // add pagination
router.get('/notice/:id', noticeController.getById);

// Trainer Report
router.get('/reports/trainer-report', reportController.trainerReport);
router.get('/reports/trainer-stats', reportController.getTrainerStats);


module.exports = router;
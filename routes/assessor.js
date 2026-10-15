const express = require('express');
const router = express.Router();
// const { authenticateJWT } = require('../services/AuthController');
const UserController = require('../controller/UserController');
const batchAssessorController = require('../controller/BatchAssessorController');
const authController  =  require("../controller/auth");
const {batchAssessmentController} = require('../controller/BatchAssessmentController');
const reportController = require('../controller/ReportController');
const noticeController = require('../controller/NoticeController');


// Protect all routes below this line
router.use(authController.authenticateToken);   
router.use(authController.authorizeRole('assessor')); 

// Batch CRUD
router.get('/batch', batchAssessorController.get); // add pagination
router.get('/batch/:id', batchAssessorController.getById);

// Batch CRUD
router.get('/batchAssessment', batchAssessmentController.get); // add pagination
router.get('/batchAssessment/:id', batchAssessmentController.getById);
router.post('/batchAssessment',  batchAssessmentController.create);
router.put('/batchAssessment/:id',  batchAssessmentController.updateById);
router.delete('/batchAssessment/:id',  batchAssessmentController.deleteById);

// User CRUD
router.get('/users', UserController.get);
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.updateById);
router.delete('/users/:id', UserController.deleteById);

// Notice CRUD
router.get('/notice', noticeController.get); // add pagination
router.get('/notice/:id', noticeController.getById);

router.get('/reports/assessor-report', reportController.assessorReport);
router.get('/reports/assessor-stats', reportController.getAssessorStats);

module.exports = router;
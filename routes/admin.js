const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const courseController = require('../controller/CourseController');
const categoryController = require('../controller/CategoryController');
const {feedbackController} = require('../controller/FeedbackController');
const lessonsController = require('../controller/LessonsController');
const blogController = require('../controller/BlogController');
const bannerController = require('../controller/BannerController');
const noticeController = require('../controller/NoticeController');
const newsLetterController = require('../controller/NewsLetterController');
const galleryController = require('../controller/GalleryController');
const mapController = require('../controller/MapController');
const authController  =  require("../controller/auth");
const batchController = require('../controller/BatchController');
const resourcePdfController = require('../controller/ResourcePdfController');
const reportController = require('../controller/ReportController');
const courseSegmentController = require('../controller/CourseSegmentController');
const {batchAdminAssessmentController} = require('../controller/BatchAssessmentController');
const talentFormController = require('../controller/TalentFormController');
const governingCouncilController = require('../controller/GoverningCouncilController');
const teamMemberController = require('../controller/TeamMemberController');

const {candidateRegistrationController } = require('../controller/CandidateRegistrationController');

// Protect all routes below this line
router.use(authController.authenticateToken);
router.use(authController.authorizeRole(['admin','subadmin']));


// Notice CRUD
router.get('/notice', noticeController.get); // add pagination
router.get('/notice/:id', noticeController.getById);
router.post('/notice',  noticeController.create);
router.put('/notice/:id',  noticeController.updateById);
router.delete('/notice/:id',  noticeController.deleteById);

// Resourse pdf CRUD
router.get('/resourcePdf', resourcePdfController.get); // add pagination
router.get('/resourcePdf/:id', resourcePdfController.getById);
router.post('/resourcePdf',  resourcePdfController.create);
router.put('/resourcePdf/:id',  resourcePdfController.updateById);
router.delete('/resourcePdf/:id',  resourcePdfController.deleteById);

// Batch CRUD
router.get('/batch', batchController.get); // add pagination
router.get('/batch/:id', batchController.getById);
router.post('/batch',  batchController.create);
router.put('/batch/:id',  batchController.updateById);
router.delete('/batch/:id',  batchController.deleteById);

// Batch CRUD
router.get('/batchAssessment', batchAdminAssessmentController.get); // add pagination
router.get('/batchAssessment/:id', batchAdminAssessmentController.getById);

// Blog CRUD
router.get('/blog', blogController.get);
router.get('/blog/:id', blogController.getById);
router.post('/blog',  blogController.create);
router.put('/blog/:id',  blogController.updateById);
router.delete('/blog/:id',  blogController.deleteById);

// Category CRUD
router.get('/menu/category', categoryController.getAll);
router.get('/category', categoryController.get); // add pagination
router.get('/category/:id', categoryController.getById);
router.post('/category', categoryController.create);
router.put('/category/:id',  categoryController.updateById);
router.delete('/category/:id',  categoryController.deleteById);

// courseSegment CRUD
router.get('/courseSegment', courseSegmentController.get); // add pagination
router.get('/courseSegment/:id', courseSegmentController.getById);
router.post('/courseSegment',  courseSegmentController.create);
router.put('/courseSegment/:id',  courseSegmentController.updateById);
router.delete('/courseSegment/:id',  courseSegmentController.deleteById);


// Newsletter CRUD
router.get('/menu/newsLetter', newsLetterController.getAll);
router.get('/newsLetter', newsLetterController.get); // add pagination
router.get('/newsLetter/:id', newsLetterController.getById);
router.post('/newsLetter',  newsLetterController.create);
router.put('/newsLetter/:id',  newsLetterController.updateById);
router.delete('/newsLetter/:id',  newsLetterController.deleteById);

// Banner CRUD
router.get('/menu/banner', bannerController.getAll);
router.get('/banner', bannerController.get); // add pagination
router.get('/banner/:id', bannerController.getById);
router.post('/banner',  bannerController.create);
router.put('/banner/:id',  bannerController.updateById);
router.delete('/banner/:id',  bannerController.deleteById);

// Map CRUD
router.get('/menu/map', mapController.getAll);
router.get('/map', mapController.get); // add pagination
router.get('/map/:id', mapController.getById);
router.post('/map', mapController.create);
router.put('/map/:id', mapController.updateById);
router.delete('/map/:id', mapController.deleteById);

// Gallery CRUD
router.get('/menu/gallery', galleryController.getAll);
router.get('/gallery', galleryController.get); // add pagination
router.get('/gallery/:id', galleryController.getById);
router.post('/gallery',  galleryController.create);
router.put('/gallery/:id',  galleryController.updateById);
router.delete('/gallery/:id',  galleryController.deleteById);

// Course CRUD
router.get('/courses', courseController.get);
router.get('/courses/:id', courseController.getById);
router.post('/courses',  courseController.create);
router.put('/courses/:id',  courseController.updateById);
router.delete('/courses/:id',  courseController.deleteById);


// Feedback CRUD
router.get('/feedbacks', feedbackController.get);
router.get('/feedbacks/:id', feedbackController.getById);
router.put('/feedbacks/:id', feedbackController.updateById); // for visibilty update true falus

// Lessons CURD
router.get('/course/:course/lessons', lessonsController.get);
router.get('/lessons/:id', lessonsController.getById);
router.post('/lessons',  lessonsController.create);
router.put('/lessons/:id',  lessonsController.updateById);
router.delete('/lessons/:id',  lessonsController.deleteById);

// User CRUD
router.get('/users', UserController.get);
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.updateById);
router.delete('/users/:id', UserController.deleteById);

//Report Module
router.get('/reports/trainer-report', reportController.trainerReport);
router.get('/reports/trainer-stats', reportController.getTrainerStatsAdmin);
router.get('/reports/assessor-report', reportController.assessorReport);
router.get('/reports/assessor-stats', reportController.getAssessorStatsAdmin);

// // Custom endpoints
router.get('/dashboard-stats', UserController.getDashboardStats);

// Candidate Registration Admin
router.get('/candidateRegistration', candidateRegistrationController.get); // add pagination
router.get('/candidateRegistration/:id', candidateRegistrationController.getById);

router.get('/talentForm', talentFormController.get); // add pagination
router.get('/talentForm/:id', talentFormController.getById);
router.put('/talentForm/:id', talentFormController.updateById);


// Governing Council CRUD (admin, protected)
router.get('/governingCouncil', governingCouncilController.get);
router.get('/governingCouncil/:id', governingCouncilController.getById);
router.post('/governingCouncil', governingCouncilController.create);
router.put('/governingCouncil/:id', governingCouncilController.updateById);
router.delete('/governingCouncil/:id', governingCouncilController.deleteById);

// Team Member CRUD (admin, protected)
router.get('/teamMember', teamMemberController.get);
router.get('/teamMember/:id', teamMemberController.getById);
router.post('/teamMember', teamMemberController.create);
router.put('/teamMember/:id', teamMemberController.updateById);
router.delete('/teamMember/:id', teamMemberController.deleteById);

module.exports = router;
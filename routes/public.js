const express = require('express');
const router = express.Router();
// const { authenticateJWT } = require('../services/AuthController');
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
const batchController = require('../controller/BatchController');
const industrySurveyController = require('../controller/IndustrySurveyController');
const talentFormController = require('../controller/TalentFormController');
const resourcePdfController = require('../controller/ResourcePdfController');
const signUpNewsletterController = require('../controller/SignUpNewsletterController');
const {candidateRegistrationController} = require('../controller/CandidateRegistrationController');
const courseSegmentController = require('../controller/CourseSegmentController');
const governingCouncilController = require('../controller/GoverningCouncilController');
const teamMemberController = require('../controller/TeamMemberController');




// Notice CRUD
router.get('/notice', noticeController.get); // add pagination
router.get('/notice/:id', noticeController.getById);

// User CRUD
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.updateById);
router.delete('/users/:id', UserController.deleteById);

// Resourse pdf CRUD
router.get('/resourcePdf', resourcePdfController.get); // add pagination
router.get('/resourcePdf/:id', resourcePdfController.getById);

// Industry Survey CRUD
router.get('/industrySurvey', industrySurveyController.get); // add pagination
router.get('/industrySurvey/:id', industrySurveyController.getById);
router.post('/industrySurvey',  industrySurveyController.create);

// Talent form CRUD
router.get('/talentForm/:id', talentFormController.getById);
router.post('/talentForm',  talentFormController.create);
router.put('/talentForm/:id', talentFormController.updateById);


// Candidate form CRUD
router.get('/candidateRegistration/:id', candidateRegistrationController.getById);
router.post('/candidateRegistration',  candidateRegistrationController.create);
router.put('/candidateRegistration/:id', candidateRegistrationController.updateById);

// Sign Up Newsletter CRUD
router.get('/signUpNewsletter', signUpNewsletterController.get); // add pagination
router.get('/signUpNewsletter/:id', signUpNewsletterController.getById);
router.post('/signUpNewsletter', signUpNewsletterController.create);


// Batch CRUD
router.get('/batch', batchController.get); // add pagination
router.get('/batch/:id', batchController.getById);

// Blog CRUD
router.get('/blog', blogController.get);
router.get('/blog/:id', blogController.getById);

// Category CRUD
router.get('/category', categoryController.get); // add pagination
router.get('/category/:id', categoryController.getById);

// courseSegment CRUD
router.get('/courseSegment', courseSegmentController.get); // add pagination
router.get('/courseSegment/:id', courseSegmentController.getById);


// Newsletter CRUD
router.get('/newsLetter', newsLetterController.get); // add pagination
router.get('/newsLetter/:id', newsLetterController.getById);

// Banner CRUD
router.get('/banner', bannerController.get); // add pagination
router.get('/banner/:id', bannerController.getById);

// Map CRUD
router.get('/map', mapController.get); // add pagination
router.get('/map/:id', mapController.getById);

// Gallery CRUD
router.get('/gallery', galleryController.get); // add pagination
router.get('/gallery/:id', galleryController.getById);

// Course CRUD
router.get('/courses', courseController.get);
router.get('/courses/:id', courseController.getById);

// Feedback CRUD
router.get('/feedbacks', feedbackController.get);
router.get('/feedbacks/:id', feedbackController.getById);

// Lessons CURD
router.get('/course/:course/lessons', lessonsController.get);
router.get('/lessons/:id', lessonsController.getById);

// User CRUD
router.get('/users', UserController.get);
router.get('/users/:id', UserController.getById);

// Governing Council (public read)
router.get('/governingCouncil', governingCouncilController.get);
router.get('/governingCouncil/:id', governingCouncilController.getById);

// Team Member (public read)
router.get('/teamMember', teamMemberController.get);
router.get('/teamMember/:id', teamMemberController.getById);
module.exports = router;
const express = require('express')
const userController = require('../controllers/userControllers')
const courseController = require('../controllers/courseController')
const upload = require('../middlewares/multerMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')
const router = express.Router()
const jobController = require('../controllers/jobController')
const pdfMulterConfig = require('../middlewares/pdfMulterMiddleware')
const applicationController = require('../controllers/applicationController')

router.post('/register',userController.registerController)
router.post('/login',userController.loginController)
router.post('/google-login',userController.googleLoginController)
router.post('/application/add',jwtMiddleware,pdfMulterConfig.single('resume'),applicationController.addApplicationController)
// ------------admin-----------------------------------
router.post('/add-course',jwtMiddleware,upload.fields([
    { name: 'thumbnail', maxCount: 1 },       // single course image
    { name: 'videoUrl', maxCount: 50 },  // multiple videos
    { name: 'fileUrl', maxCount: 50 }     // multiple PDFs
  ]),courseController.addCourseController)
router.post('/admin/addJob',adminJwtMiddleware,jobController.addJobController)
//Delete Job
router.delete('/job/:id/remove',adminJwtMiddleware,jobController.removeJobController)
router.put('/admin-profile/edit',adminJwtMiddleware,upload.single('profile'),userController.adminProfileEditController)
//view application
//--------------------user
router.get('/get-allJobs',jobController.getAllJobController)
router.get('/home-courses',courseController.getHomeCourses)
//-------------------------authorised user
router.get('/all-courses',jwtMiddleware,courseController.getAllCoursesController)
router.get('/courses/:id/view',jwtMiddleware,courseController.viewCourseController)
router.get('/get-enrolled-details',adminJwtMiddleware,courseController.getAllEnrollments)
router.get('/get-enrolled-stats',adminJwtMiddleware,courseController.getCourseStats)
//user profile update 
router.put('/user-profile/edit',jwtMiddleware,upload.single('profile'),userController.userProfileEditController)
router.get('/all-application',adminJwtMiddleware,applicationController.getApplicationController)
router.post('/make-payment',jwtMiddleware,courseController.makeBookPaymentController)
router.get('/verify-payment', jwtMiddleware, courseController.verifyPaymentAndEnroll);
module.exports = router

const express = require('express')
const userController = require('../controllers/userControllers')
const courseController = require('../controllers/courseController')
const upload = require('../middlewares/multerMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const router = express.Router()

router.post('/register',userController.registerController)
router.post('/login',userController.loginController)
router.post('/google-login',userController.googleLoginController)
router.post('/add-course',jwtMiddleware,upload.fields([
    { name: 'thumbnail', maxCount: 1 },       // single course image
    { name: 'videoUrl', maxCount: 50 },  // multiple videos
    { name: 'fileUrl', maxCount: 50 }     // multiple PDFs
  ]),courseController.addCourseController)

module.exports = router

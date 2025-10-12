const express = require('express')
const userController = require('../controllers/userControllers')
const router = express.Router()

router.post('/register',userController.registerController)

module.exports = router

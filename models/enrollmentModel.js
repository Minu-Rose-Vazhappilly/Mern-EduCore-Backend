const mongoose = require('mongoose')
const users = require('./userModel')
const course = require('./courseModel')
const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  coursePrice: {
    type: Number,
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status:{
    type:String,
    default:"ongoing"
  }
});
const enrollments = mongoose.model('Enrollment', enrollmentSchema)
module.exports = enrollments

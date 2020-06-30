const express = require('express')
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses')

//bring in Course model
const Course = require('../models/Course')

//advanceResults middleware
const advancedResults = require('../middleware/advancedResults')
//auth middleware
const {protect, authorize} = require('../middleware/auth')

const router = express.Router({mergeParams: true})

router.route('/')
  .get(
    advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), createCourse) // doesnt need full /bootcamp/:bootcampId etc because of the redirect in bootcamps router

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)


module.exports = router

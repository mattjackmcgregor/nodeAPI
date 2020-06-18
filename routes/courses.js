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

const router = express.Router({mergeParams: true})

router.route('/')
  .get(
    advancedResults(Course, {
    path: 'bootcmap',
    select: 'name description'
    }),
    getCourses
  )
  .post(createCourse) // doesnt need full /bootcamp/:bootcampId etc because of the redirect in bootcamps router

router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)


module.exports = router

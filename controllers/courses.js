const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')


// @desc      get all courses
// @route     api/v1/courses
// @route     api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query

  if(req.params.bootcampId) {
    query = Course.find({bootcamp: req.params.bootcampId})
  } else {
    query = Course.find()
  }

  const courses = await query

  res.status(200).json({
    sucess: true,
    count: courses.length,
    data: courses
  })
})
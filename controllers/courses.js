const Course = require('../models/Course')
const Bootcamp= require('../models/Bootcamp')
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
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    })
  }

  const courses = await query

  res.status(200).json({
    sucess: true,
    count: courses.length,
    data: courses
  })
})

// @desc      get single course
// @route     api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcmap',
    select: 'name description'
  })

  if(!course) {
     return next(new ErrorResponse('course with this id doesnt exits', 404))
  }

  res.status(200).json({
    sucess: true,
    data: course
  })
})

// @desc      create course
// @route     api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  //getting bootcamp that the course is for
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  //setting the bootcamp id in the request body
  req.body.bootcamp = req.params.bootcampId

  if(!bootcamp) {
     return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
  }

  const course = await Course.create(req.body)

  res.status(201).json({
    sucess: true,
    msg: 'course created',
    data: course
  })
})

// @desc      update course
// @route     api/v1//courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!course) {
    return next(new ErrorResponse('course with this id doesnt exits', 404))
  }

  res.status(201).json({
    sucess: true,
    msg: 'course created',
    data: course
  })
})
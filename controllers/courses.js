const Course = require('../models/Course')
const Bootcamp= require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')


// @desc      get all courses
// @route     api/v1/courses
// @route     GET api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if(req.params.bootcampId) {
    const course = await Course.find({bootcamp: req.params.bootcampId})
    res.status(200).json({
      success: true,
      count: course.length,
      data: course
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc      get single course
// @route     GET api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description' 
  })

  if(!course) {
     return next(new ErrorResponse('course with this id doesnt exits', 404))
  }

  res.status(200).json({
    success: true,
    data: course
  })
})

// @desc      create course
// @route     CREATE api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  //getting bootcamp that the course is for
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  //setting the bootcamp id in the request body
  req.body.bootcamp = req.params.bootcampId
  //adding user to body
  req.body.user = req.user.id

  if(!bootcamp) {
     return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
  }

  //checking ownership
   if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to add a course to bootcamp with id ${bootcamp.id}`, 401))
   }

  const course = await Course.create(req.body)

  res.status(201).json({
    success: true,
    msg: 'course created',
    data: course
  })
})

// @desc      update course
// @route     PUT api/v1//courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse('course with this id doesnt exits', 404))
  }

  if (course.user.toString() !== req.user.id && req.user.role !=='admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to update a this course with id ${course.id}`))
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    msg: 'course updated',
    data: course
  })
})

// @desc      delete course
// @route     DELETE api/v1//courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse('course with this id doesnt exits', 404))
  }
  await course.remove()
  res.status(200).json({
    success: true,
    msg: 'course deleted',
    data: course
  })
})
const Reviews = require('../models/Reviews')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')


// @desc      get all Reviews
// @route     GET api/v1/reviews
// @route     GET api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Reviews.find({
      bootcamp: req.params.bootcampId
    })
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc      get single Review
// @route     GET api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if(!review) {
    return next(new ErrorResponse(`review with id of ${req.params.id} does not exist`, 404))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})

// @desc      create review
// @route     POST api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.createReview = asyncHandler(async (req, res, next) => {
  //setting bootcampId and user to request body
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  //checking if bootcamp exist
  if(!bootcamp) {
    return next(new ErrorResponse(`bootcamp with id ${req.params.bootcampId} doesn't exist`, 404))
  }

  //checking if user role
  if(req.user.role !=='user') {
    return next(new ErrorResponse(`We support honest reviews. Only users can leave reviews for bootcamps.`, 401))
  }

  //creating review
  const review = await Reviews.create(req.body)

  res.status(201).json({
    sucess: true,
    message: 'created review sucessfully',
    data: review
  })
})

// @desc      Update review
// @route     PUT api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  
  let review = await Reviews.findById(req.params.id)

  //checking if review exist
  if (!review) {
    return next(new ErrorResponse(`bootcamp with id ${req.params.id} doesn't exist`, 404))
  }

  //checking if user role
  if (review.user.toString() !== req.user.id && req.user.role !== 'user') {
    return next(new ErrorResponse(`user with id of ${req.user.id} is not authorized to update review with id of ${req.params.id}`, 401))
  }

  review = await Reviews.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(201).json({
    sucess: true,
    message: 'updated review sucessfully',
    data: review
  })
})

// @desc      Delete review
// @route     DELETE api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

  const review = await Reviews.findById(req.params.id)

  //checking if review exist
  if (!review) {
    return next(new ErrorResponse(`bootcamp with id ${req.params.id} doesn't exist`, 404))
  }

  //checking if authorized
  if (review.user.toString() !== req.user.id && req.user.role !== 'user') {
    return next(new ErrorResponse(`user with id of ${req.user.id} is not authorized to update review with id of ${req.params.id}`, 401))
  }

  await review.remove()

  res.status(201).json({
    sucess: true,
    message: 'removed review sucessfully',
    data: review
  })
})
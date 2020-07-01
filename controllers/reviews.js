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
  const review = Reviews.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name, description'
  })

  if(!review) {
    return next(new ErrorResponse(`review with id of ${req.params.id} does not exist`, 404))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})
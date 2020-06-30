const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      get all users
// @route     api/v1/auth/users
// @access    Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc      get user by id
// @route     api/v1/authusers/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user) {
    return next(new ErrorResponse(`user with id of ${req.params.id} doesnt exist `))
  }

  res.status(200).json({
    sucess: true,
    message: 'fetched user successfully',
    data: user
  })
})
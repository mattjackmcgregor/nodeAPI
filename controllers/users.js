const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      get all users
// @route     GET api/v1/auth/users
// @access    Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc      get user by id
// @route     GET api/v1/auth/users/:id
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

// @desc      create user
// @route     POST api/v1/auth/users
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)
 
  if(req.user.role !=='admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to create a user`, 401))
  }

  res.status(200).json({
    sucess: true,
    message: 'created user successfully',
    data: user
  })
})

// @desc      update user
// @route     PUT api/v1/auth/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`user with id of ${req.params.id} doesnt exist `))
  }

  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to update this user`, 401))
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    sucess: true,
    message: 'updated user successfully',
    data: user
  })
})

// @desc      delete user
// @route     DELETE api/v1/auth/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`user with id of ${req.params.id} doesnt exist `))
  }

  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to delete this user`, 401))
  }

  await user.remove()

  res.status(200).json({
    sucess: true,
    message: 'removed user successfully',
    data: user
  })
})
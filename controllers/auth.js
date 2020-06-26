const Path = require('path')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Register user
// @route     POST api/v1/auth/register
// @access    Public
exports.registerUser = asyncHandler (async (req, res, next) => {
  //grabing user data from the body
  const {name, email, password, role} = req.body

  //creating user obj for database
  const user = await User.create({
    name,
    email,
    password,
    role
  })
  //getting signed JWT token 
  const token = user.getSignedJwtToken()

  res.status(201).json({
    sucess: true,
    msg: 'created user',
    data: token
  })
})

// @desc      Login user
// @route     POST api/v1/auth/login
// @access    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  //grabing user data from the body
  const {
    email,
    password,
  } = req.body

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('please provide valid email and password', 400))
  }

  //getting users email and typed password
  const user = await User.findOne({email}).select('+password')

  //validate user
  if(!user) {
    return next(new ErrorResponse('invalid credentials', 401))
  }

  //check password
  const isMatch = await user.matchPassword(password)

  if(!isMatch){
    return next(new ErrorResponse('invalid credentials', 401))
  }

  //getting signed JWT token 
  const token = user.getSignedJwtToken()

  res.status(201).json({
    sucess: true,
    msg: 'logged in',
    data: token
  })
})
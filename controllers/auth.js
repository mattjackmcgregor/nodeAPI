const Path = require('path')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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
  sendTokenResponse(user, 200, res)
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
  sendTokenResponse(user, 200, res)
  
})


// @desc      logout
// @route     GET api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler( async (req, res, next) => {
  
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    sucess: true,
    message: 'loggedout',
    data: {}
  })
})

// @desc      get user
// @route     GET api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    sucess: true,
    data: user
  })
})

// @desc      update details
// @route     PUT api/v1/auth/updateDetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    sucess: true,
    data: user
  })
})

// @desc      update password
// @route     PUT api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')
  
  const isMatch = await user.matchPassword(req.body.currentPassword)
  if(!isMatch) {
    return next(new ErrorResponse('password is incorrect '))
  }
  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)

  res.status(200).json({
    sucess: true,
    data: user
  })
})

// @desc      forgot password
// @route     post api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({email: req.body.email})

  if(!user){
    return next(new ErrorResponse('user with that email doesnt exist', 404))
  }

  //get resetToken and store hash version in db (function in User schema methods)
  const resetToken = user.getResetToken()

  //sending normal version in email
  await user.save({validateBeforeSave: false})

  //create reset url
  const resetUrl = `${req.protocol}://${req.host}/api/v1/auth/resetpassword/${resetToken}`
  //email message
  const message = `You are recieving the email because you (or someone else) requested to reset a password. please make a PUT request to: \n\n ${resetUrl} `

  try {
    //sending email 
    await sendEmail({
      email: user.email,
      subject: "Password reset token ",
      message
    })
    res.status(200).json({
      sucess: true,
      data: 'email sent'
    })
  } catch (error) {
    console.log(error)
    //removing potential lingering risk
    this.resetPasswordToken = undefined
    this.resetPasswordExpire = undefined
    //saving user without tokens
    await user.save({validateBeforeSave: false})

    return next(new ErrorResponse('email could not be sent', 500))
  }
})

// @desc      reset password
// @route     GET api/v1/auth/resetpassword/:resettoken
// @access    Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  
  //getting the hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
  //find user with token and check reset token hasnt expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  })

  if(!user) {
    return next(new ErrorResponse('invalid token', 400))
  }
  //set new password user sent in body 
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  //sending new signed in JWT token 
  sendTokenResponse(user, 200, res)
  
})


//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  //setting cookie expiry 30 days from now time
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      sucess: true,
      token
    })
}
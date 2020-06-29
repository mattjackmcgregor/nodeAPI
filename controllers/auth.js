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
   if(process.env.NODE_ENV === 'production'){
     options.secure = true
   }
   

   res
    .status(statusCode)
    .cookie('TOKEN', token, options)
    .json({
      sucess: true,
      token
    })
}

// @desc      get user
// @route     GET api/v1/auth/lme
// @access    Private
exports.getMe = asyncHandler( async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    sucess: true,
    data: user
  })
})
const Path = require('path')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Register user
// @route     GET api/v1/auth/register
// @access    Public
exports.registerUser = asyncHandler (async (req, res, next) => {
  //grabing user data from the body
  const {name, email, password} = req.body

  const user = await User.create({
    name,
    email,
    password
  })

  const token = user.getSignedJwtToken()

  res.status(201).json({
    sucess: true,
    msg: 'created user',
    data: token
  })

})
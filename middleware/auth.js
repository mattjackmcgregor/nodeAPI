const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

exports.protect = asyncHandler( async (req, res, next) => {
  let token
  console.log(req.headers)
  // if header exist splitting from Bearer and setting token 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1]
    console.log(token)
  } 
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  //check if token exists
  if(!token) {
    return next(new ErrorResponse('not authorised to access this route', 401))
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decode)
    req.user = await User.findById(decode.id)
    next()
  } catch (error) {
    return next(new ErrorResponse('not authorised to access this route', 401))
  }
 

})
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = {...err}

  error.message = err.message
  //logging to console for dev
  console.log(error)
  

  //Mongoose bad ObjectId
  if(err.name === 'CastError'){
    const message = `Resourse with id ${err.value} doesnt exits`
    error = new ErrorResponse(message, 404)
  }

  //Mongoose Duplicate value
  if(err.code === 11000) {
    const message = "duplicate field value entered"
    error = new ErrorResponse(message, 400)
  }

  //Mongoose field requirment validation
  if (err.name === 'ValidatonError') {
      const message = Object.values(err.errors).map(val => val.name)
      error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = {...err}

  error.message = err.message
  //logging to console for dev
  console.log(err.stack.red)
  console.log(err.name)

  //Mongoose bad ObjectId
  if(err.name === 'CastError'){
    const message = `Resourse with id ${err.value} doesnt exits`
    error = new ErrorResponse(message, 404)
    
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler
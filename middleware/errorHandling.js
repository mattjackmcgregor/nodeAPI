const errorHandler = (err, req, res, next) => {
  //logging to console for dev
  console.log(err.stack.red)

  res.status(err.statusCode || 500).json({
    sucess: false,
    error: err.message || 'Server Error'
  })
}

module.exports = errorHandler
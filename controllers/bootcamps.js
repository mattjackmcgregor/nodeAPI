
// @desc      get all bootcamps
// @route     api/v1/bootcamps
// @access    Public
exports.getAllBootcamps = (req, res, next) => {  
  res.json({
    msg: 'get all bootcamps'
  })
}
// @desc      get single bootcamp
// @route     api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = (req, res, next) => {  
  res.json({
    msg: `get bootcamp ${req.params.id}`
  })
}
// @desc      create bootcamp
// @route     api/v1/bootcamps
// @access    Private
exports.postBootcamp = (req, res, next) => {  
  res.json({
    msg: 'post bootcamp'
  })
}
// @desc      update bootcamp
// @route     api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = (req, res, next) => {  
  res.json({
    msg: `update bootcamp ${req.params.id}`
  })
}
// @desc      delete bootcamp
// @route     api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = (req, res, next) => {  
  res.json({
    msg: `delete bootcamp ${req.params.id}`
  })
}
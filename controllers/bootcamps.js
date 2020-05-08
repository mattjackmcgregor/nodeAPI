const Bootcamp = require('../models/bootcamp')

// @desc      get all bootcamps
// @route     api/v1/bootcamps
// @access    Public
exports.getAllBootcamps = async (req, res, next) => {  
  try {
    const bootcamp = await Bootcamp.find()
    res
    .status(200)
    .json({
      sucess: true,
      data: bootcamp
    })
  } catch (error) {
    res.json(400)
  }
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
exports.postBootcamp = async (req, res, next) => {  
  try {
    const bootcamp = await Bootcamp.create(req.body)
    // console.log(req.body)
    res
      .status(201)
      .json({
        sucess: true,
        msg: `created bootcamp`
      })
      console.log('bootcamp created')
    
  } catch (error) {
    console.log(error)
    res.json(error)
  }
  
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
const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// @desc      get all bootcamps
// @route     api/v1/bootcamps
// @access    Public
exports.getAllBootcamps = asyncHandler (async (req, res, next) => {  
 
    const bootcamp = await Bootcamp.find()
    res
    .status(200)
    .json({
      sucess: true,
      count: bootcamp.length,
      data: bootcamp
    })
})

// @desc      get single bootcamp
// @route     api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler (async (req, res, next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id)

    //MUST RETURN else error about set headers will show
    if(!bootcamp) {
      return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
      // return res.status(400).json({
      //   sucess: false,
      //   msg: 'bootcamp with this id doesnt exits'
      // })
    }
    res.status(200).json({
      sucess: true,
      msg: 'fetched bootcamp sucessfully',
      data: bootcamp
    })
  // } catch (error) {
  //   next(error)
  //   // res.status(400).json({
  //   //   sucess: false,
  //   //   msg: error
  //   // })
  // }
})

// @desc      create bootcamp
// @route     api/v1/bootcamps
// @access    Private
exports.postBootcamp = asyncHandler (async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    // console.log(req.body)
    res
      .status(201)
      .json({
        sucess: true,
        msg: `created bootcamp`,
        data: bootcamp
      })
      console.log('bootcamp created')
})
// @desc      update bootcamp
// @route     api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler (async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!bootcamp) {
      return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
    }
    
    res.status(200).json({
      sucess: true,
      msg: 'bootcamp updated',
      data: bootcamp
    })
})

// @desc      delete bootcamp
// @route     api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler (async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
       return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
    }
    res.status(200).json({
      sucess: true,
      msg: 'bootcamp sucessfully deleted',
      data: {}
    })
})

// @desc      get bootcamps within radius
// @route     api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {zipcode, distance} = req.params
  
  //get lat and long
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //find bootcamps within radius
  const bootcamps = await Bootcamp.find({
    loc: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat], distance / 6371
        ]
      }
    }
  })
  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps
  })
})
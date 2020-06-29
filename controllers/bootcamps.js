const Path = require('path')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')


// @desc      get all bootcamps
// @route     GET api/v1/bootcamps
// @access    Public
exports.getAllBootcamps = asyncHandler (async (req, res, next) => {  
  console.log(req.query)
  res.status(200).json(res.advancedResults)
})

// @desc      get single bootcamp
// @route     GET api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler (async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses')

    //MUST RETURN else error about set headers will show
    if(!bootcamp) {
      return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
      // return res.status(400).json({
      //   sucess: false,
      //   msg: 'bootcamp with this id doesnt exits'
      // })
    }
    res.status(200).json({
      success: true,
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
// @route     CREATE api/v1/bootcamps
// @access    Private
exports.postBootcamp = asyncHandler (async (req, res, next) => {
  //add user to body
  req.body.user = req.user.id

  //check if published bootcmp
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})

  //checking ownership
  if(publishedBootcamp && req.user.role !=='admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} has already published a bootcamp`, 400))
  }

  const bootcamp = await Bootcamp.create(req.body)
  // console.log(req.body)
  res
    .status(201)
    .json({
      success: true,
      msg: `created bootcamp`,
      data: bootcamp
    })
    console.log('bootcamp created')
})
// @desc      update bootcamp
// @route     PUT api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler (async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id)
  
    if (!bootcamp) {
      return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
    }
    
    if (bootcamp.user.toString() !==req.user.id && req.user.role !=='admin') {
      return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to updae this bootcamp`, 401))
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    
    res.status(200).json({
      success: true,
      msg: 'bootcamp updated',
      data: bootcamp
    })
})

// @desc      delete bootcamp
// @route     DELETE api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler (async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
       return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
    }

    bootcamp.remove()

    res.status(200).json({
      success: true,
      msg: 'bootcamp sucessfully deleted',
      data: {}
    })
})

// @desc      get bootcamps within radius
// @route     api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {zipcode, distance} = req.params
  //get lat and long
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude
  //calc radius using radians distance / radius of earth in Kilometers
  const radius = distance / 6371
  //find bootcamps within radius
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ]}}
  })
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc      upload photo for bootcamp
// @route     PUT api/v1/bootcamps/:id/photo
// @access    Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
  }

  //checking bootcamp ownership
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`publisher with id ${req.user.id} is not authorized to updae this bootcamp`, 401))
  }

 if (!req.files) {
   return next(new ErrorResponse('please upload a photo', 404))
 }
 console.log(req.files.file)
 const file = req.files.file

 if (!file.mimetype.startsWith('image')) {
  return next(new ErrorResponse('wrong file type, please upload an image', 404))
 }

 if (file.size > process.env.MAX_FILE_SIZE) {
  return next(new ErrorResponse(`image size is too big, please upload an image of size les than ${process.env.MAX_FILE_SIZE} `, 404))
 }

 //create custom filename
 file.name = `bootcamp_photo_${req.params.id}${Path.parse(file.name).ext}`

 //storing the file in folder
 file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
   if(err) {
     console.log(err)
     return next(new ErrorResponse(`problem with upload`, 500))
   }

   await Bootcamp.findByIdAndUpdate(req.params.id, {
     photo: file.name
   })
    res.status(200).json({
      success: true,
      msg: 'bootcamp photo sucessfuly uploaded',
      data: file.name
    })
 })
 
 
})
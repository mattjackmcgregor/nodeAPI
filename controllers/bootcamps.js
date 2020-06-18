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
  let query
  //copy of req query
  const reqQuery = {...req.query}
  //feilds to exclude from query
  const removeFeilds = ['select', 'sort', 'page', 'limit']
  //loop over and delete from query
  removeFeilds.forEach(feild => delete reqQuery[feild])
  //query object to string
  let queryStr = JSON.stringify(reqQuery)
 

  //create mongodb query operators 
  queryStr = queryStr.replace(/\b(eq|gt|gte|in|lt|lte|ne|nin)\b/g, match => `$${match}`)
  console.log(queryStr)

  //finding query results
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  //select query check
  if (req.query.select) {
    let feilds = req.query.select.split(',').join(' ')
    query = query.select(feilds)
  }

  //sort query check
  if (req.query.sort) {
    let sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query.sort('createdAt')
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  //startIndex specifies numer of docs to skip to return the ones you are trying to recieve
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  //adding pagnation to query
  query = query.skip(startIndex).limit(limit)

  //executing query
  const bootcamp = await query

  //pagination
  const pagination = {}

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  res
  .status(200)
  .json({
    sucess: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp
  })
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
// @route     CREATE api/v1/bootcamps
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
// @route     PUT api/v1/bootcamps/:id
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
// @route     DELETE api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler (async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
       return next(new ErrorResponse('bootcamp with this id doesnt exits', 404))
    }

    bootcamp.remove()

    res.status(200).json({
      sucess: true,
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
    sucess: true,
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
      sucess: true,
      msg: 'bootcamp photo sucessfuly uploaded',
      data: file.name
    })
 })
 
 
})
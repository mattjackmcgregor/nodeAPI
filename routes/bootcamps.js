const express = require('express')
const {
  getAllBootcamps,
  getBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
} = require('../controllers/bootcamps')

//advanced middleware
const advancedResults = require('../middleware/advancedResults')

//bring in bootcamps model
const Bootcamp = require('../models/Bootcamp')

//bringing in other routes for redirect
const courseRoutes = require('./courses')

//auth middleware
const {protect} = require('../middleware/auth')

const router = express.Router()

//redirecting to appropriate routes
router.use('/:bootcampId/courses', courseRoutes)

router.route('/:id/photo')
  .put(protect, uploadBootcampPhoto)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/')
.get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
.post(protect, postBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(protect, updateBootcamp)
.delete(protect, deleteBootcamp)



module.exports = router;
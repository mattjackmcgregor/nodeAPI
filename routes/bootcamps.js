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
const {protect, authorize} = require('../middleware/auth')

const router = express.Router()

//redirecting to appropriate routes
router.use('/:bootcampId/courses', courseRoutes)

router.route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/')
.get(advancedResults(Bootcamp, 'courses'), getAllBootcamps)
.post(protect, authorize('publisher', 'admin'), postBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(protect, authorize('publisher', 'admin'), updateBootcamp)
.delete(protect, authorize('publisher', 'admin'), deleteBootcamp)



module.exports = router;
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

//bring in bootcamps model
const Bootcamp = require('../models/Bootcamp')

//bringing in other routes for redirect
const courseRoutes = require('./courses')
const reviewsRoutes = require('./reviews')

//auth middleware
const {protect, authorize} = require('../middleware/auth')
//advanced middleware
const advancedResults = require('../middleware/advancedResults')

const router = express.Router()

//redirecting to appropriate routes
router.use('/:bootcampId/courses', courseRoutes)
router.use('/:bootcampId/reviews', reviewsRoutes)

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
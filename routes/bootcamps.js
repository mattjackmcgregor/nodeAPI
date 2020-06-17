const express = require('express')
const {
  getAllBootcamps,
  getBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps')

//bringing in other routes for redirect
const courseRoutes = require('./courses')

const router = express.Router()

//redirecting to appropriate routes
router.use('/:bootcampId/courses', courseRoutes)


router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/')
.get(getAllBootcamps)
.post(postBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)



module.exports = router;
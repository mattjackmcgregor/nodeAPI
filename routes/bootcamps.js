const express = require('express')
const {
  getAllBootcamps,
  getBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require('../controllers/bootcamps')

const router = express.Router()

router.route('/')
.get(getAllBootcamps)
.post(postBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)


module.exports = router;
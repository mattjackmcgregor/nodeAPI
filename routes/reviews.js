const express = require('express')
const {
  getReviews
} = require('../controllers/reviews')

//bring in Reviews model
const Reviews = require('../models/Reviews')

//advanceResults middleware
const advancedResults = require('../middleware/advancedResults')
//auth middleware
const {
  protect,
  authorize
} = require('../middleware/auth')

const router = express.Router({
  mergeParams: true
})

router.route('/')
  .get(
    advancedResults(Reviews, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )



module.exports = router
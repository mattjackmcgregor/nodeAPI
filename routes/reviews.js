const express = require('express')
const {
  getReviews,
  getReview,
  CreateReview
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
  .post(protect, authorize('user'), CreateReview)
router.route('/:id')
    .get(getReview)





module.exports = router
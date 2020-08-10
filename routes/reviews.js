const express = require('express')
const { getReviews } = require('../controllers/reviews')

const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')

const router = express.Router({ mergeParams: true })

//protect middleware
const { protect, authorize } = require('../middleware/auth')

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'business', select: 'name description' }),
    getReviews
  )

module.exports = router

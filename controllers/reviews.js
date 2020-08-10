const Review = require('../models/Review')
const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/businesses/:businessId/reviews
//@access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.businessId) {
    const reviews = await Review.find({ business: req.params.businessId })
    //check if any services for the business exist
    if (reviews.length === 0) {
      return next(
        new ErrorResponse(
          `There are no reviews for business ${req.params.businessId}`,
          404
        )
      )
    }
    //if they exist
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    //all reviews
    res.status(200).json(res.advancedResults)
  }
})

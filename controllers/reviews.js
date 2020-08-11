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

//@desc Get a single review
//@route GET /api/v1/reviews/:id
//@access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'business',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: review,
  })
})

//@desc Add review
//@route POST /api/v1/businesses/:businessId/reviews
//@access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  //set user and business id to body
  req.body.business = req.params.businessId
  req.body.user = req.user.id

  //check if business exists
  const business = await Business.findById(req.params.businessId)

  if (!business) {
    next(
      new ErrorResponse(`Business ${req.params.businessId} does not exist`, 404)
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

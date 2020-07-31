const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all businesses
//@route GET /api/v1/businesses
//@access Public
exports.getBusinesses = asyncHandler(async (req, res, next) => {
  const businesses = await Business.find()

  res
    .status(200)
    .json({ success: true, count: businesses.length, data: businesses })
})

//@desc Get a single businesss
//@route GET /api/v1/businesses/:id
//@access Public
exports.getBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.findById(req.params.id)

  if (!business) {
    return next(err)
  }

  res.status(200).json({ success: true, data: business })
})

//@desc Create a new businesss
//@route GET /api/v1/businesses
//@access Private
exports.createBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.create(req.body)

  res.status(201).json({
    success: true,
    data: business,
  })
})

//@desc Update a business
//@route PUT /api/v1/businesses/:id
//@access Private
exports.updateBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  //make sure business exists
  if (!business) {
    next(err)
  }

  res.status(200).json({ success: true, data: business })
})

//@desc Delete a business
//@route PUT /api/v1/businesses/:id
//@access Private
exports.deleteBusiness = asyncHandler(async (req, res, next) => {
  const business = await Business.findByIdAndDelete(req.params.id)
  //make sure business exists
  if (!business) {
    next(err)
  }

  res.status(200).json({ success: true, data: 'business deleted' })
})

const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')

//@desc Get all businesses
//@route GET /api/v1/businesses
//@access Public
exports.getBusinesses = asyncHandler(async (req, res, next) => {
  let query
  //make a copy of query
  const reqQuery = {
    ...req.query,
  }
  //fields to remove from query
  const removeFields = ['select', 'sort', 'page', 'limit']
  //loop over removed fields
  removeFields.forEach((param) => delete reqQuery[param])
  //turn query into string to manipulate
  let queryStr = JSON.stringify(reqQuery)
  //regex for adding $
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  //turn query string back into json and find resource
  query = Business.find(JSON.parse(queryStr)).populate('services')

  //Select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = Number(req.query.page) || 1
  const limit = parseInt(req.query.limit, 10) || 20
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Business.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //finish query
  const businesses = await query

  //pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: businesses.length,
    pagination,
    data: businesses,
  })
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
  const business = await Business.findById(req.params.id)
  //make sure business exists
  if (!business) {
    return next(
      new ErrorResponse(
        `Business not found with an id of ${req.params.id}`,
        404
      )
    )
  }

  //must use .remove to trigger remove middleware on business model
  bootcamp.remove()

  res.status(200).json({ success: true, data: 'business deleted' })
})

//@desc Get a business within a certain radius
//@route GET /api/v1/businesses/radius/:zipcode/:distance
//@access Private
exports.getBusinessesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963

  const businesses = await Business.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    success: true,
    count: businesses.length,
    data: businesses,
  })
})

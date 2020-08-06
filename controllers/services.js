const Service = require('../models/Service')
const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all services
//@route GET /api/v1/services/
//@route GET /api/v1/businesses/:businessId/services
//@access Public
exports.getServices = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.businessId) {
    query = await Service.find({ business: req.params.businessId })
    //check if any services for the business exist
    if (query.length === 0) {
      return res.status(404).json({
        msg: `There are no services for business ${req.params.businessId}`,
      })
    }
  } else {
    //populate with business name/description associated with service
    query = await Service.find().populate({
      path: 'business',
      select: 'name description',
    })
    if (query.length === 0) {
      return res.status(404).json({
        msg: `There are no services for this particular query`,
      })
    }
  }

  res.status(200).json({
    success: true,
    count: query.length,
    data: query,
  })
})

//@desc Get a single Service
//@route GET /api/v1/services/:id
//@access Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate({
    path: 'business',
    select: 'name description',
  })

  if (!service) {
    return next(
      new ErrorResponse(`No service with the id of ${req.params.id}`),
      404
    )
  }

  res.status(200).json({
    success: true,
    data: service,
  })
})

//@desc Add a course
//@route  POST /api/v1/businesses/:businessId/services
//@access Private
exports.addService = asyncHandler(async (req, res, next) => {
  //set url id to req.body
  req.body.business = req.params.businessId

  const business = await Business.findById(req.params.businessId)

  if (!business) {
    return next(
      new ErrorResponse(`No business with the id of ${req.params.businessId}`),
      404
    )
  }

  //save body contents to db
  const service = await Service.create(req.body)

  res.status(200).json({
    success: true,
    data: service,
  })
})

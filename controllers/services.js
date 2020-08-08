const Service = require('../models/Service')
const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Get all services
//@route GET /api/v1/services/
//@route GET /api/v1/businesses/:businessId/services
//@access Public
exports.getServices = asyncHandler(async (req, res, next) => {
  if (req.params.businessId) {
    const services = await Service.find({ business: req.params.businessId })
    //check if any services for the business exist
    if (services.length === 0) {
      return next(
        new ErrorResponse(
          `There are no services for business ${req.params.businessId}`,
          404
        )
      )
    }
    //if they exist
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    })
  } else {
    //all services
    res.status(200).json(res.advancedResults)
  }
})

//@desc Get a single Service
//@route GET /api/v1/services/:id
//@access Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate(
    'business',
    'name description'
  )

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

//@desc Add a service
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

//@desc Update a service
//@route  PUT /api/v1/service/:id
//@access Private
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id)

  if (!service) {
    return next(
      new ErrorResponse(`No service with the id of ${req.params.id}`),
      404
    )
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: service,
  })
})

//@desc Delete a service
//@route  DELETE /api/v1/service/:id
//@access Private
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id)

  if (!service) {
    return next(
      new ErrorResponse(`No service with the id of ${req.params.id}`),
      404
    )
  }

  await service.remove()

  res.status(200).json({
    success: true,
    data: `Service with ID of ${req.params.id} removed`,
  })
})

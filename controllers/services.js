const Service = require('../models/Service')
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

//else if (req.params.serviceType) {
//query = await Service.find({ serviceType: req.params.serviceType })
//check if any services of the service type exist
//if (query.length === 0) {
//return res.status(404).json({
//msg: `There are no services of service type ${req.params.serviceType}`,
//})
//}
//}

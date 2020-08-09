const Business = require('../models/Business')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')
const path = require('path')

//@desc Get all businesses
//@route GET /api/v1/businesses
//@access Public
exports.getBusinesses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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
  //add user to req.body
  req.body.user = req.user.id
  //limit publisher to one business posting
  const publishedBusiness = await Business.findOne({ user: req.user.id })

  //if user !== admin, they can only post one business
  if (publishedBusiness && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a business`,
        400
      )
    )
  }

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

//@desc Upload photo for business
//@route PUT /api/v1/businesses/:id/photo
//@access Private
exports.businessPhotoUpload = asyncHandler(async (req, res, next) => {
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
  //check if a file upload
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }
  //console.log(req.files) to check attributes
  const file = req.files.file
  //Make sure img is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`), 404)
  }
  //Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }
  //Create custom filename
  file.name = `photo_${business._id}${path.parse(file.name).ext}`
  //upload the file to public/uploads file path
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }
    await Business.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
})

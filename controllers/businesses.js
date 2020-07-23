//@desc Get all businesses
//@route GET /api/v1/businesses
//@access Public
exports.getBusinesses = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all businesses' })
}

//@desc Get a single businesss
//@route GET /api/v1/businesses/:id
//@access Public
exports.getBusiness = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Get a business' })
}

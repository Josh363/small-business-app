const Business = require('../models/Business')

//@desc Get all businesses
//@route GET /api/v1/businesses
//@access Public
exports.getBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find()

    res
      .status(200)
      .json({ success: true, count: businesses.length, data: businesses })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

//@desc Get a single businesss
//@route GET /api/v1/businesses/:id
//@access Public
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)

    if (!business) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: business })
  } catch (err) {
    //res.status(400).json({ success: false })
    next(err)
  }
}

//@desc Create a new businesss
//@route GET /api/v1/businesses
//@access Private
exports.createBusiness = async (req, res, next) => {
  try {
    const business = await Business.create(req.body)

    res.status(201).json({
      success: true,
      data: business,
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

//@desc Update a business
//@route PUT /api/v1/businesses/:id
//@access Private
exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    //make sure business exists
    if (!business) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: business })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

//@desc Delete a business
//@route PUT /api/v1/businesses/:id
//@access Private
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id)
    //make sure business exists
    if (!business) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: 'business deleted' })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

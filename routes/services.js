const express = require('express')
const {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
} = require('../controllers/services')

const Service = require('../models/Service')
const advancedResults = require('../middleware/advancedResults')

const router = express.Router({ mergeParams: true })

//protect middleware
const { protect } = require('../middleware/auth')

router
  .route('/')
  .get(
    advancedResults(Service, { path: 'business', select: 'name description' }),
    getServices
  )
  .post(protect, addService)

router
  .route('/:id')
  .get(getService)
  .put(protect, updateService)
  .delete(protect, deleteService)

module.exports = router

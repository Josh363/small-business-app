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

router
  .route('/')
  .get(
    advancedResults(Service, { path: 'business', select: 'name description' }),
    getServices
  )
  .post(addService)

router.route('/:id').get(getService).put(updateService).delete(deleteService)

module.exports = router

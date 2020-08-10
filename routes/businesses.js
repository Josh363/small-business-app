const express = require('express')
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessesInRadius,
  businessPhotoUpload,
} = require('../controllers/businesses')

const Business = require('../models/Business')
const advancedResults = require('../middleware/advancedResults')

//include resource routers
const serviceRouter = require('./services')
const reviewRouter = require('./reviews')

const router = express.Router()

//protect middleware
const { protect, authorize } = require('../middleware/auth')

//re-route in other routers...forward to router if it matches url
router.use('/:businessId/services', serviceRouter)
router.use('/:businessId/reviews', reviewRouter)

router.route('/radius/:zipcode/:distance').get(getBusinessesInRadius)

router
  .route('/')
  .get(advancedResults(Business, 'services'), getBusinesses)
  .post(protect, authorize('publisher', 'admin'), createBusiness)

router
  .route('/:id')
  .get(getBusiness)
  .put(protect, authorize('publisher', 'admin'), updateBusiness)
  .delete(protect, authorize('publisher', 'admin'), deleteBusiness)

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), businessPhotoUpload)

module.exports = router

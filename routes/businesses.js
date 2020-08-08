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

const router = express.Router()

//re-route in other routers
router.use('/:businessId/services', serviceRouter)

router.route('/radius/:zipcode/:distance').get(getBusinessesInRadius)

router
  .route('/')
  .get(advancedResults(Business, 'services'), getBusinesses)
  .post(createBusiness)

router.route('/:id').get(getBusiness).put(updateBusiness).delete(deleteBusiness)

router.route('/:id/photo').put(businessPhotoUpload)

module.exports = router

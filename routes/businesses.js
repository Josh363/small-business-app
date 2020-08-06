const express = require('express')
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessesInRadius,
} = require('../controllers/businesses')

//include resource routers
const serviceRouter = require('./services')

const router = express.Router()

//re-route in other routers
router.use('/:businessId/services', serviceRouter)

router.route('/radius/:zipcode/:distance').get(getBusinessesInRadius)

router.route('/').get(getBusinesses).post(createBusiness)

router.route('/:id').get(getBusiness).put(updateBusiness).delete(deleteBusiness)

module.exports = router

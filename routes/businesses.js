const express = require('express')
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessesInRadius,
} = require('../controllers/businesses')

const router = express.Router()

router.route('/radius/:zipcode/:distance').get(getBusinessesInRadius)

router.route('/').get(getBusinesses).post(createBusiness)

router.route('/:id').get(getBusiness).put(updateBusiness).delete(deleteBusiness)

module.exports = router

const express = require('express')
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require('../controllers/businesses')

const router = express.Router()

router.route('/').get(getBusinesses).post(createBusiness)

router.route('/:id').get(getBusiness).put(updateBusiness).delete(deleteBusiness)

module.exports = router

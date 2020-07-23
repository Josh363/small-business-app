const express = require('express')
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require('../controllers/businesses')

const router = express.Router()

router.route('/').get(getBusinesses)

router.route('/:id').get(getBusiness)

module.exports = router

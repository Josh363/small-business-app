const express = require('express')
const {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
} = require('../controllers/services')

const router = express.Router({ mergeParams: true })

router.route('/').get(getServices).post(addService)

router.route('/:id').get(getService).put(updateService).delete(deleteService)

module.exports = router

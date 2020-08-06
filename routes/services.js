const express = require('express')
const {
  getServices,
  getService,
  addService,
} = require('../controllers/services')

const router = express.Router({ mergeParams: true })

router.route('/').get(getServices).post(addService)

router.route('/:id').get(getService)

module.exports = router

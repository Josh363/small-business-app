const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a service name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a service description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a service price'],
  },
  serviceType: {
    type: String,
    required: [true, 'Please add a type for this service'],
  },
  creditAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
})

module.exports = mongoose.model('Service', ServiceSchema)

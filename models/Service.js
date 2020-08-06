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
    type: String,
    required: [true, 'Please add a service price'],
  },
})

const mongoose = require('mongoose')
const Business = require('./Business')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title review'],
    maxLength: 100,
  },
  description: {
    type: String,
    required: [true, 'Please add a review description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1-10'],
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Review', ReviewSchema)
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

//Prevent user from submitting more than one review per business
ReviewSchema.index({ business: 1, user: 1 }, { unique: true })

//Static method to get average review rating
ReviewSchema.statics.getAverageRating = async function (businessId) {
  const obj = await this.aggregate([
    {
      $match: { business: businessId },
    },
    {
      $group: {
        _id: '$business',
        averageRating: { $avg: '$rating' },
      },
    },
  ])
  //add averageRating to Business Model
  try {
    if (obj[0]) {
      await this.model('Business').findByIdAndUpdate(businessId, {
        averageRating: obj[0].averageRating.toFixed(2),
      })
    } else {
      await this.model('Business').findByIdAndUpdate(businessId, {
        averageRating: undefined,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

//Call getAverageRating after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.business)
})

//Call getAverageRating before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.business)
})

module.exports = mongoose.model('Review', ReviewSchema)

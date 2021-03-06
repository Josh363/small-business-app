const mongoose = require('mongoose')
const Business = require('./Business')

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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

//Static method to get average service cost
ServiceSchema.statics.getAverageCost = async function (businessId) {
  const obj = await this.aggregate([
    {
      $match: { business: businessId },
    },
    {
      $group: {
        _id: '$business',
        averageCost: { $avg: '$price' },
      },
    },
  ])
  //add averageServiceCost to Business Model
  try {
    if (obj[0]) {
      await this.model('Business').findByIdAndUpdate(businessId, {
        averageCost: obj[0].averageCost.toFixed(2),
      })
    } else {
      await this.model('Business').findByIdAndUpdate(businessId, {
        averageCost: undefined,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

//Call getAverageCost after save
ServiceSchema.post('save', function () {
  this.constructor.getAverageCost(this.business)
})

//Call getAverageCost before remove
ServiceSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.business)
})

module.exports = mongoose.model('Service', ServiceSchema)

const mongoose = require('mongoose')

const ReviewsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please provide a title for review']
  },
  text: {
    type: String,
    required: [true, 'please provide a review']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'please provide a rating between 1 and 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})


module.exports = mongoose.model('Reviews', ReviewsSchema)
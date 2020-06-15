const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please provide a course title']
  },
  description: {
    type: String,
    required: [true, 'please provide a course description']
  },
  weeks: {
    type: String,
    required: [true, 'please provide number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'please provide a course cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'please provide a course description'],
    enum: ['beginner', 'intermediate', 'advance']
  },
  scholarship:{
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Course', CourseSchema)
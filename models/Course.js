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
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
})

//static method to get avg tuition cost each bootcamp
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log(`getting average cost ...`.blue)

  const obj = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: {$avg: '$tuition'}
      }
    }
  ])

  try {
    console.log(obj)
   
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: obj[0].averageCost
    })
     console.log(bootcampId)
  } catch (error) {
    console.log('average cost error', error)
  }
}

//call getAverageCost after save
CourseSchema.post('save', async function() {
  await this.constructor.getAverageCost(this.bootcamp)
})
//call getAverageCost before remove
CourseSchema.post('remove', async function() {
  await this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
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

//prevent user from submitting more than 1 review per bootcamp
ReviewsSchema.index({bootcamp: 1, user: 1}, {unique: true})

//static method to get avg rating for each bootcamp
ReviewsSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([{
      $match: {
        bootcamp: bootcampId
      }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {
          $avg: '$rating'
        }
      }
    }
  ])

  try {
    console.log(obj)
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    })
  } catch (error) {
    console.log('average cost error', error)
  }
}

//call getAverageCost after save
ReviewsSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.bootcamp)
})
//call getAverageCost before remove
ReviewsSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.bootcamp)
})



module.exports = mongoose.model('Reviews', ReviewsSchema)
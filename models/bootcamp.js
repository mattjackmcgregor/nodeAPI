const mongoose = require('mongoose')
const slugify = require('slugify')

const BootcampSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'name cannot be more then 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'please add a description'],
    maxlength: [500, 'name cannot be more then 500 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'please provide url to match http/https'
    ]
  },
  phone: {
    type: String,
    maxlength: 20,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add valid email'
    ]
  },
  address: {
    type: String,
    require: [true, 'please provide address'],
  },
  location: {
    //GeoJson point
    type: {
      type: String,
      enum: ['Point'],
      require: true,
    },
    coordinates: {
      type: Number,
      require: true,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'rating must be atleaset 1'],
    max: [10, 'can not be more then 10']
  },
  averageCost: {
    type: Number,
  },
  photo: {
    type: String,
    default: 'no-photo'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

}) 

//creating slug
BootcampSchema.pre('save', function() {
 this.slug = slugify(this.name, {lower: true})
 next()
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)
  
 

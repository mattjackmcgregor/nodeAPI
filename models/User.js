const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
name: {
  type: String,
  required: [true, 'please add a name']
},
email: {
  type: String,
  required: [true, 'please add an email'],
  unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add valid email'
    ]
},
role: {
  type: String,
  enum: ['user', 'publisher'],
  default: 'user'
},
password: {
  type: String,
  required: [true, 'please add a password'],
  minlength: 6,
  select: false
},
resetPasswordToken: String,
resetPasswordExpire: Date,
createdAt: {
  type: Date,
  default: Date.now
}
})

//password encryption
UserSchema.pre('save', async function(next) {

  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//jsonwebtoen 
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })
}

//matching password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//generate and hash password token
UserSchema.methods.getResetToken = function() {
  //generate token
  const resetToken = crypto.randomBytes(20).toString('hex')
  //hash token and set to resetPasswordToken feild in user
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //token expire date 
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model('User', UserSchema)

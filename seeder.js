const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

// load env vars 
dotenv.config({path: './config/config.env'})

//load Bootcamp models
const Bootcamp = require('./models/Bootcamp')
//load Course models
const Course = require('./models/Course')
//connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

//run in terminal: node seeder.js -i
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    console.log('data imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

//run in terminal: node seeder.js -d
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    console.log('data deleted'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}

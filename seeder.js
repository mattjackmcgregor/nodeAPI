const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

// load env vars 
dotenv.config({path: './config/config.env'})

//load bootcamp models
const Bootcamp = require('./models/bootcamp')

//connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('data imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
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

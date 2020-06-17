const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')

const errorHandler = require('./middleware/errorHandling')
const logger = require('./middleware/logger')
const connDB = require('./config/db')


//import env vars
dotenv.config({path: 'config/config.env'})

//connect mongoDB
connDB()

//import routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

//setting port
const PORT = process.env.PORT || 5000


const app = express()

//body parser
app.use(express.json())

// mounting routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

//dev logger
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))  
}

//custom middleware
app.use(logger)
app.use(errorHandler)


const server = app.listen(PORT, () => {
  console.log(`application is running in ${process.env.NODE_ENV} and server is on port ${PORT}`.yellow);
});

//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`error: ${err.message}`.red)
  server.close(() => process.exit(1))
})
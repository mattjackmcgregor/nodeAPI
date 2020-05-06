const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const logger = require('./middleware/logger')
const connDB = require('./config/db')

//import env vars
dotenv.config({path: 'config/config.env'})

//connect mongoDB
connDB()

//import routes
const bootcamps = require('./routes/bootcamps')

const PORT = process.env.PORT || 5000

const app = express()

//dev logger
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))  
}

//custom logger
app.use(logger)


// mounting routes
app.use('/api/v1/bootcamps', bootcamps)


const server = app.listen(PORT, () => {
  console.log(`application is running in ${process.env.NODE_ENV} and server is on port ${PORT}`);
});

//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`error: ${err.message}`)
  server.close(() => process.exit(1))
})
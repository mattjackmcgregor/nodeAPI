const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
//import env vars
dotenv.config({path: 'config/config.env'})

//import routes
const bootcamps = require('./routes/bootcamps')

const PORT = process.env.PORT || 5000

const app = express()

//custom logger
app.use(logger)

// mounting routes
app.use('/api/v1/bootcamps', bootcamps)


app.listen(PORT, () => {
  console.log(`application is running in ${process.env.NODE_ENV} and server is on port ${PORT}`);
});
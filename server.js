const Path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandling')
const logger = require('./middleware/logger')
const connDB = require('./config/db')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

//import env vars
dotenv.config({path: 'config/config.env'})

//connect mongoDB
connDB()

//import routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')


//setting port
const PORT = process.env.PORT || 5000


const app = express()

app.use(express.static(Path.join(__dirname, 'public')))

//body parser
app.use(express.json())
// app.use(express.json({
//   limit: '50mb'
// }));
// app.use(express.urlencoded({
//   limit: '50mb',
//   extended: true
// }));

//cookie parser
app.use(cookieParser())

//express file uploader middleware
app.use(fileUpload())

//sanitize data
app.use(mongoSanitize())

//security headers protection
app.use(helmet())

//xss protection
app.use(xss())

//rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

//hpp params polution
app.use(hpp())

//enable CORS
app.use(cors())

// mounting routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/auth/users', users)
app.use('/api/v1/reviews', reviews)

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
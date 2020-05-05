const express = require('express')
const dotenv = require('dotenv')

//import env vars
dotenv.config({path: 'config/config.env'})

const PORT = process.env.PORT || 5000

const app = express()

app.listen(PORT, () => {
  console.log(`application is running in ${process.env.NODE_ENV} and server is on port ${PORT}`);
});
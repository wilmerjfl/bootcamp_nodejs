const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const uploadfiles = require('express-fileupload')
//Load enviroment variables
dotenv.config()

//Load Config
const { connectDB } = require('./config/db')
const PORT = process.env.PORT || 3000

//Import Middleware
const errorHandler = require('./middleware/error')

//Import Routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const fileUpload = require('express-fileupload')
//Connect to database
connectDB()

//Running App
const app = express()

//Dev Logger Middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
}

// File uploading
app.use(fileUpload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Body Parser
app.use(express.json())

//Use Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

//Use Middlewares
app.use(errorHandler)

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))

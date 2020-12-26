const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')

//Load enviroment variables
dotenv.config()

//Load Config
const { connectDB } = require('./config/db')
const PORT = process.env.PORT || 3000

//Import Middleware
const errorHandler = require('./middleware/error')

//Import Routes
const bootcamps = require('./routes/bootcamps')

//Connect to database
connectDB()

//Running App
const app = express()

//Body Parser
app.use(express.json())

//Use Routes
app.use('/api/v1/bootcamps', bootcamps)

//Use Middlewares
app.use(errorHandler)

//Dev Logger Middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan(':method :url code :status - :response-time ms'))
}

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))
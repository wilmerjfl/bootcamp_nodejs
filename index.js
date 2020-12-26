const express = require('express')
const dotenv = require('dotenv')
//const routes = require('./Routes')

//Load enviroment variables
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))



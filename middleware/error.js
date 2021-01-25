const ErrorResponse = require("../utils/errorResponse")

module.exports = errorHandler = (err, req, res, next) => {

  let error = { ...err }
  error.message = err.message
  //Log to console for dev
  if(process.env.NODE_ENV === 'development'){
    console.log(err.stack.red)
  }
  console.log(err)
  if (err.name === 'CastError'){
    const message = `Bootcamp not found with id ${error.value}`
    error = new ErrorResponse(message, 404)
  }
  res.status(error.statusCode || 500).json({
    success: false,
    data: error.message || 'Server Error'
  })
}
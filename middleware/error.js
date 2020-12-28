module.exports = errorHandler = (err, req, res, next) => {
  //Log to console for dev
  if(process.env.NODE_ENV === 'development'){
    console.log(err.stack.red)
  }

  res.status(err.statusCode || 500).json({
    success: false,
    data: err.message || 'Server Error'
  })
}
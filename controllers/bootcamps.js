const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
// @desc      Get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc      Create a bootcamp
// @route      POST /api/v1/bootcamps
// @access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    data: bootcamp
  })
})

// @desc      Get one bootcamp
// @route      GET /api/v1/bootcamp/:id
// @access     Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp){
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404))
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  })
})
// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc[0];
  // Calc radius usion radians
  // Divide distance by radius od Earth
  // Earth radius = 3,963 mi / 6,378 km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [ longitude, latitude ], radius ] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})
// @desc      Update a bootcamp
// @route      PUT /api/v1/bootcamp/:id
// @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!bootcamp){
      return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404))
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  })
})

// @desc      Delete a bootcamp
// @route      DELETE /api/v1/bootcamp/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (!bootcamp){
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404))
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  })
})
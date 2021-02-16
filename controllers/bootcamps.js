const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
// @desc      Get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  const removeFields = ['select', 'sort', 'page', 'limit']
  let reqQuery = { ...req.query }
  removeFields.forEach(param => delete reqQuery[param])
  // Fix query to mongodb
  let query = JSON.stringify(reqQuery)
  reqQuery = JSON.parse(query.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`))
  query = Bootcamp.find(reqQuery).populate('courses')

  if(req.query.select){
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //console.log(query)
  const bootcamps = await query

  const pagination = {}

  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
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
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp){
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404))
  }

  bootcamp.remove()
  
  res.status(200).json({
    success: true,
    data: bootcamp
  })
})
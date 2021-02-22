const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
// @desc      Get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Create a bootcamp
// @route      POST /api/v1/bootcamps
// @access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Get one bootcamp
// @route      GET /api/v1/bootcamp/:id
// @access     Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`,
            404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {zipcode, distance} = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const {latitude, longitude} = loc[0];
  // Calc radius usion radians
  // Divide distance by radius od Earth
  // Earth radius = 3,963 mi / 6,378 km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}},
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
// @desc      Update a bootcamp
// @route      PUT /api/v1/bootcamp/:id
// @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Delete a bootcamp
// @route      DELETE /api/v1/bootcamp/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404));
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Upload photo for a bootcamp
// @route      PUT /api/v1/bootcamp/:id/photo
// @access     Private
exports.photoBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  const file = req.files.file;
  // Check bootcamp
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} don't exits`, 404));
  }
  // Check file in the request
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload image file`, 400));
  }

  // Check File size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }
  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Problems with file upload`, 500));
      }
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

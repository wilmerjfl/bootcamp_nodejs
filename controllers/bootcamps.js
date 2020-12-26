const Bootcamp = require('../models/Bootcamp')

// @desc      Get all bootcamps
//@route      GET /api/v1/bootcamps
//@access     Public
exports.getBootcamps = async (req, res, next) => {
  Bootcamp.find()
  .then((response) => res.status(200).json({
    success: true,
    total: response.length,
    data: response
  }))
  .catch((e) => res.status(e.status).json({
    success: false,
    data: e.message,
  }))
}

// @desc      Create a bootcamp
//@route      POST /api/v1/bootcamps
//@access     Private
exports.createBootcamp = (req, res, next) => {
  Bootcamp.create(req.body)
  .then((response) => res.status(201).json({
    success: true,
    data: `The bootcamp ${response.name} has been created successfuly`
  }))
  .catch((e) => res.status(e.status).json({
    success: false,
    data: e.message,
  }))
}

// @desc      Get one bootcamp
//@route      GET /api/v1/bootcamp/:id
//@access     Private
exports.getBootcamp = async (req, res, next) => {
  try{
    const bootcamp = await Bootcamp.findById(req.params.id)

    res.status(200).json({
      success: true,
      data: bootcamp
    })
  } catch(err) {
    next(err)
  }
}

// @desc      Update a bootcamp
//@route      PUT /api/v1/bootcamp/:id
//@access     Private
exports.updateBootcamp = (req, res, next) => {
  Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  .then((response) => res.status(200).json({
    success: true,
    data: response
  }))
  .catch((e) => res.status(400).json({
    success: false,
    data: e.message,
  }))
}

// @desc      Delete a bootcamp
//@route      DELETE /api/v1/bootcamp/:id
//@access     Private
exports.deleteBootcamp = (req, res, next) => {
  Bootcamp.findByIdAndDelete(req.params.id)
  .then((response) => res.status(200).json({
    success: true,
    data: response
  }))
  .catch((e) => res.status(400).json({
    success: false,
    data: e.message,
  }))
}
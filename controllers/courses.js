const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc        Get all courses
// @route      GET /api/v1/courses
// @route      GET /api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = await Course.find({bootcamp: req.params.bootcampId});

    return res.status(200).json({
      success: true,
      count: query.length,
      data: query,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc       Get single courses
// @route      GET /api/v1/courses
// @access     Private
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
        new ErrorResponse(
            `No course with the id of ${req.params.id}`),
        404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc       Create single courses
// @route      POST /api/v1/bootcamps/:bootcampId/courses
// @access     Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
        new ErrorResponse(
            `No Bootcamp with the id of ${req.params.bootcampId}`),
        404);
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
        new ErrorResponse(
            `User ${req.user.name} is not authorized to add courses in ${bootcamp.name}`,
            404));
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc       Update single courses
// @route      PUT /api/v1/courses/:id
// @access     Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
        new ErrorResponse(
            `No Bootcamp with the id of ${req.params.bootcampId}`),
        404);
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
        new ErrorResponse(
            `User ${req.user.name} is not authorized to update ${course.title}`,
            404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc       Delete a course
// @route      DELETE /api/v1/course/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
        new ErrorResponse(
            `Course with id ${req.params.id} don't exits`,
            404));
  }
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
        new ErrorResponse(
            `User ${req.user.name} is not authorized to delete ${course.title}`,
            404));
  }
  course.remove();

  res.status(200).json({
    success: true,
    data: course,
  });
});

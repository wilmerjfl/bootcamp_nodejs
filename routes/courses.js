const router = require('express').Router({mergeParams: true});

const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteBootcamp,
} = require('../controllers/courses');

const {protect, authorize} = require('../middleware/auth');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Course, {
  path: 'bootcamp',
  select: 'name description',
}), getAllCourses).post(protect, authorize('publisher', 'admin'), createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;

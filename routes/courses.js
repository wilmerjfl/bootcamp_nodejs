const router = require('express').Router({ mergeParams: true })

const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteBootcamp
} = require('../controllers/courses')

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')

router.route('/').get(advancedResults(Course, {
  path: 'bootcamp',
  select: 'name description'
}), getAllCourses).post(createCourse)

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteBootcamp)

module.exports = router;
const router = require('express').Router({ mergeParams: true })

const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteBootcamp
} = require('../controllers/courses')

router.route('/').get(getAllCourses).post(createCourse)

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteBootcamp)

module.exports = router;
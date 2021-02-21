const router = require('express').Router()
const { 
  getBootcamps,
  createBootcamp,
  getBootcamp,
  getBootcampsInRadius,
  updateBootcamp,
  deleteBootcamp, 
  photoBootcamp
} = require('../controllers/bootcamps')

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')
// Include other resource routers
const courseRouter = require('./courses')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp)

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/:id/photo').put(photoBootcamp)

module.exports = router;
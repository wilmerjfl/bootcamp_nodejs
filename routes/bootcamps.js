const router = require('express').Router();
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  getBootcampsInRadius,
  updateBootcamp,
  deleteBootcamp,
  photoBootcamp,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');
// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), photoBootcamp);

module.exports = router;

const router = require('express').Router()
const { 
  getBootcamps,
  createBootcamp,
  getBootcamp,
  getBootcampsInRadius,
  updateBootcamp,
  deleteBootcamp } = require('../controllers/bootcamps')

router.route('/')
  .get(getBootcamps)
  .post(createBootcamp)

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/:zipcode/:distance')
  .get(getBootcampsInRadius)
  
module.exports = router;
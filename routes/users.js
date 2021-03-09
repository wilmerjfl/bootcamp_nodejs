const router = require('express').Router();
const {
  updateDetails,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user');

const {protect, authorize} = require('../middleware/auth');
const advanceResults = require('../middleware/advancedResults');
const User = require('../models/User');

router.use(protect);
router.put('/updateme', updateDetails);
router.use(authorize('admin'));

router.route('/')
    .get(advanceResults(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;

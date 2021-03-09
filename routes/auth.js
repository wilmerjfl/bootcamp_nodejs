const router = require('express').Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

router.post('/register', register);

router.route('/login').post(login);

router.get('/me', protect, getMe);

router.post('/forgot', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

router.put('/updatepassword', protect, updatePassword);

module.exports = router;

const router = require('express').Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

router.post('/register', register);

router.route('/login').post(login);

router.get('/me', protect, getMe);

router.post('/forgot', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;

const router = require('express').Router();

const {register, login, getMe} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

router.post('/register', register);

router.route('/login').post(login);

router.get('/me', protect, getMe);

module.exports = router;

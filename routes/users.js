const router = require('express').Router();
const {updateDetails} = require('../controllers/user');
const {protect} = require('../middleware/auth');

router.put('/update', protect, updateDetails);

module.exports = router;

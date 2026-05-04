const userService = require('../services/userService');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const router = require('express').Router();

router.get('/information', userService.getUserInformation);

router.post('/update', userService.updateProfile);

router.post('')
module.exports = router;
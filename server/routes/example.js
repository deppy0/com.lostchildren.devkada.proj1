const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const router = require('express').Router();

router.get('/port', function(req, res) {
	res.json({ port: process.env.PORT });
});

module.exports = router;
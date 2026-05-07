const { auth } = require('../services/auth.service.js');
const log_service = require('../services/log.service.js');
const router = require('express').Router();

router.post('/vitals', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const vitals_list = await log_service.getAllVitals(user_id);
		return res.json({ success: true, vitals_list });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/intakes', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const intake_list = await log_service.getAllIntakes(user_id);
		return res.json({ success: true, intake_list });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

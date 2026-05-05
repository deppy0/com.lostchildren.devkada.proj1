const { auth } = require('../services/auth.service.js');
const schedule_service = require('../services/schedule.service.js');
const router = require('express').Router();

router.post('/today', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const schedule = await schedule_service.getTodaySchedule(user_id);
		return res.json({ success: true, schedule });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

const { auth } = require('../services/auth.service.js');
const vitals_service = require('../services/vitals.service.js');
const router = require('express').Router();

router.post('/record', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { systolic, diastolic, heart_bpm, temperature_celsius, weight_kg, blood_sugar_mmol } = req.body;
		const vitals_log_id = await vitals_service.recordVitals(user_id, systolic, diastolic, 
			heart_bpm, temperature_celsius, weight_kg, blood_sugar_mmol);
		return res.json({ success: true, vitals_log_id });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

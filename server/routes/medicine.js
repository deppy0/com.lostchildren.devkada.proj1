const { auth } = require('../services/auth.service.js');
const medicine_service = require('../services/medicine.service.js');
const router = require('express').Router();

router.post('/add', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { medicine_json } = req.body;
		const medicine_id = await medicine_service.addMedicine(user_id, medicine_json);
		return res.json({ success: true, medicine_id });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/remove', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { medicine_id } = req.body;
		const success = await medicine_service.removeMedicine(medicine_id);
		return res.json({ success });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const medicines = await medicine_service.getAllMedicines(user_id);
		return res.json({ success: true, medicines });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get-active', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const active_medicines = await medicine_service.getAllActiveMedicines(user_id);
		return res.json({ success: true, active_medicines });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/intake', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { schedule_id, intake_type, date_scheduled } = req.body;
		const intake_log_id = await medicine_service.intakeMedicine(user_id, schedule_id, intake_type, date_scheduled);
		return res.json({ success: true, intake_log_id });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

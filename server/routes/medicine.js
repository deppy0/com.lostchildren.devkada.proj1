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

router.post('/get', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const medicines = await medicine_service.getAllMedicines(user_id);
		return res.json({ success: true, medicines });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get-otc', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const otc_medicines = await medicine_service.getAllOTCMedicines(user_id);
		return res.json({ success: true, otc_medicines });
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

router.post('/get-active-otc', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const active_otc_medicines = await medicine_service.getAllActiveOTCMedicines(user_id);
		return res.json({ success: true, active_otc_medicines });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get-warn', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const warned_stocks = await medicine_service.getMedicineWarnedStocks(user_id);
		return res.json({ success: true, warned_stocks });
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

router.post('/missed', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { schedule_id } = req.body;
		const json_result = await medicine_service.missedMedicine(user_id, schedule_id);
		return res.json({ success: true, json_result });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/add-stocks', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { medicine_id, add_amount } = req.body;
		const new_total = await medicine_service.addMedicineStocks(user_id, medicine_id, add_amount);
		return res.json({ success: true, new_total });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/subtract-stocks', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { medicine_id, subtract_amount } = req.body;
		const new_total = await medicine_service.subtractMedicineStocks(user_id, medicine_id, subtract_amount);
		return res.json({ success: true, new_total });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/remove', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { medicine_id } = req.body;
		const success = await medicine_service.removeMedicine(user_id, medicine_id);
		return res.json({ success });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

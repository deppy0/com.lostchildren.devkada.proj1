const { auth } = require('../services/auth.service.js');
const prescription_service = require('../services/prescription.service.js');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { doctor_name, doc_specialization, date_issued, meds_list } = req.body;
		if (!meds_list || !Array.isArray(meds_list) || meds_list.length < 1)
			return res.status(400).json({ error: 'List of medicines is required for a prescription.' });
		const prescription_id = await prescription_service.addPrescription(user_id, doctor_name, doc_specialization, date_issued, meds_list);
		return res.json({ success: true, prescription_id });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

// API to link an image to an existing prescription
router.patch('/:id/image', auth, upload.single('image'), async function(req, res) {
	try {
		const user_id = req.user.id;
		const prescriptionId = req.params.id;
		const file = req.file;

		if (!file) return res.status(400).json({ error: 'No image provided.' });

		const publicUrl = await prescription_service.uploadPrescriptionImage(
			user_id,
			prescriptionId,
			file.buffer,
			file.originalname,
			file.mimetype
		);

		return res.json({ success: true, image_url: publicUrl });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/remove', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const { prescription_id } = req.body;
		const success = await prescription_service.removePrescription(user_id, prescription_id);
		return res.json({ success });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const prescriptions = await prescription_service.getAllPrescriptions(user_id);
		return res.json({ success: true, prescriptions });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

router.post('/get-active', auth, async function(req, res) {
	try {
		const user_id = req.user.id;
		const prescriptions = await prescription_service.getAllActivePrescriptions(user_id);
		return res.json({ success: true, prescriptions });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

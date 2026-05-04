const auth_service = require('../services/auth.service.js');
const router = require('express').Router();

router.post('/login', async function(req, res) {
	try {
		const data = await auth_service.login(req.body.username, req.body.password);
		return res.json({ data });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message });
	}
});

router.post('/register', async function(req, res) {
	try {
		const data = await auth_service.register(
			req.body.email,
			req.body.password,
			req.body.first_name,
			req.body.last_name,
			req.body.guardian_name,
			req.body.guardian_contact
		);
		return res.json({ data });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message });
	}
});

router.post('/logout', auth_service.auth, async function(req, res) {
	try {
		const bearer = req.headers.authorization.split(' ')[1];
		const success = await auth_service.destroy(bearer);
		return res.json({ success });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message });
	}
});

module.exports = router;

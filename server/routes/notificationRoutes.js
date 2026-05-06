const { auth } = require('../services/auth.service.js');
const supabase = require('../database/supabase');
const router = require('express').Router();
const { sendPushToUser } = require('../services/notifService');

// Register or update push notification subscription for user device
router.post('/subscribe', auth, async (req, res) => {
	try {
		const user_id = req.user.id;
		const { subscription } = req.body;

		if (!subscription) {
			return res.status(400).json({ error: 'Subscription object required' });
		}

		const { error } = await supabase
			.from('users')
			.update({ push_subscription: subscription })
			.eq('id', user_id);

		if (error) {
			throw new Error(`Failed to save subscription: ${error.message}`);
		}

		return res.json({ success: true, message: 'Push subscription registered' });
	} catch (error) {
		return res.status(error.status || 500).json({ error: error.message || 'Unexpected error' });
	}
});

module.exports = router;

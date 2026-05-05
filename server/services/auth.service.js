const supabase = require('../database/supabase');

async function register(email, password, first_name, last_name, guardian_name, guardian_contact) {
	const { data, error } = await supabase.auth.signUp({
		email, password, options: {
			data: { first_name, last_name, guardian_name, guardian_contact },
		},
	});
	if (error) throw error;
	return data;
}

async function login(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
	return data;
}

async function auth(req, res, next) {
	try {
		const bearer = req.headers.authorization;
		if (!bearer || !bearer.startsWith('Bearer '))
			return res.status(400).json({ error: 'Malformed auth header' });
		const token = bearer.split(' ')[1];
		const { data: { user }, error } = await supabase.auth.getUser(token);
		if (error || !user)
			return error
				? res.status(error.status || 500).json({ error: error.message })
				: res.sendStatus(401);
		req.user = user;
		next();
	} catch (err) {
		return res.sendStatus(500);
	}
}

async function destroy(bearer) {
	const { error } = await supabase.auth.signOut(bearer);
	if (error) throw error;
	return true;
}

module.exports.register = register;
module.exports.login = login;
module.exports.auth = auth;

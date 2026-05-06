const supabase = require('../database/supabase');

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
				: res.sendStatus(401).json({ error: 'Unauthorized' });
		req.user = user;
		next();
	} catch (err) {
		return res.sendStatus(500);
	}
}

async function checkToken(token) {
	if (!token || !token.startsWith('Bearer '))
		throw Error('Invalid auth header');
	const main_token = token.split(' ')[1];
	const { data: { user }, error } = await supabase.auth.getUser(main_token);
	if (error) throw error;
	return user != null;
}

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

async function changePassword(user_id, new_password) {
	const { error } = await supabase.auth.admin.updateUserById(user_id, { password: new_password });
	if (error) throw error;
	return true;
}

async function destroy(bearer) {
	const { error } = await supabase.auth.signOut(bearer);
	if (error) throw error;
	return true;
}

module.exports.auth = auth;
module.exports.register = register;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.destroy = destroy;

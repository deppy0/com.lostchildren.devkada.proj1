const supabase = require('../database/supabase');

async function getAllVitals(user_id) {
	const { data: vitals_list, error: GetError } = await supabase.rpc('get_all_vitals', { param_user_id: user_id });
	if (GetError) throw GetError;
	return vitals_list;
}

async function getAllIntakes(user_id) {
	const { data: intake_list, error: GetError } = await supabase.rpc('get_all_intakes', { param_user_id: user_id });
	if (GetError) throw GetError;
	return intake_list;
}

module.exports.getAllVitals = getAllVitals;
module.exports.getAllIntakes = getAllIntakes;

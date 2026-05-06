const supabase = require('../database/supabase');

async function recordVitals(user_id, systolic, diastolic, heart_bpm) {
	const { data: vitals_log_id, error: FeatureError } = await supabase.rpc('record_vitals', {
		param_user_id: user_id,
		param_systolic: systolic,
		param_diastolic: diastolic,
		param_heart_bpm: heart_bpm,
	});
	if (FeatureError) throw FeatureError;
	return vitals_log_id;
}

module.exports.recordVitals = recordVitals;

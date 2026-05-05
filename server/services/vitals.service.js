const supabase = require('../database/supabase');

async function recordVitals(user_id, systolic, diastolic, heart_bpm, temperature_celsius, weight_kg, blood_sugar_mmol) {
	const { data: vitals_log_id, error: FeatureError } = await supabase.rpc('record_vitals', {
		param_user_id: user_id,
		param_systolic: systolic,
		param_diastolic: diastolic,
		param_heart_bpm: heart_bpm,
		param_temperature_celsius: temperature_celsius,
		param_weight_kg: weight_kg,
		param_blood_sugar_mmol: blood_sugar_mmol
	});
	if (FeatureError) throw FeatureError;
	return vitals_log_id;
}

module.exports.recordVitals = recordVitals;

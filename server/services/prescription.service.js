const supabase = require('../database/supabase');

async function addPrescription(user_id, doctor_name, date_issued, meds_list) {
	const { data: prescription_id, error: AddError } = await supabase.rpc('add_prescription', {
		param_user_id: user_id,
		param_doctor_name: doctor_name,
		param_date_issued: date_issued,
		param_meds_list: meds_list,
	});
	if (AddError) throw AddError;
	
	const { data: new_meds_list, error: QueryError } = await supabase
		.from('medicines').select('id,taken_after_meals,hourly_gap,max_per_day,start_time_per_day').eq('prescription_id', prescription_id);
	if (QueryError) throw QueryError;
	
	const schedules = new_meds_list.map(function(medicine_json) {
		return supabase.rpc('add_medicine_schedule', {
			param_user_id: user_id,
			param_medicine_json: medicine_json,
		});
	});
	const responses = await Promise.all(schedules);
	const errors = responses.filter(function(res) { return res.error });
	if (errors.length > 0)
		throw errors;
	
	return prescription_id;
}

async function removePrescription(user_id, prescription_id) {
	const { error: RemoveError } = await supabase.rpc('remove_prescription', {
		param_user_id: user_id,
		param_prescription_id: prescription_id,
	});
	if (RemoveError) throw RemoveError;
	return true;
}

async function getAllPrescriptions(user_id) {
	const { data: prescriptions, error: GetError } = await supabase.rpc('get_all_prescriptions', { param_user_id: user_id });
	if (GetError) throw GetError;
	return prescriptions;
}

async function getAllActivePrescriptions(user_id) {
	const { data: active_prescriptions, error: GetError } = await supabase.rpc('get_all_active_prescriptions', { param_user_id: user_id });
	if (GetError) throw GetError;
	return active_prescriptions;
}

module.exports.addPrescription = addPrescription;
module.exports.removePrescription = removePrescription;
module.exports.getAllPrescriptions = getAllPrescriptions;
module.exports.getAllActivePrescriptions = getAllActivePrescriptions;

const supabase = require('../database/supabase');

async function addMedicine(user_id, medicine_json) {
	const { data: medicine_id, error: AddError } = await supabase.rpc('add_medicine', {
		param_user_id: user_id,
		param_medicine_json: medicine_json,
	});	
	if (AddError) throw AddError;
	
	const { data: new_medicine_json, error: QueryError } = await supabase
		.from('medicines').select('*').eq('id', medicine_id).limit(1).single();
	if (QueryError) throw QueryError;
	
	const { error: ScheduleError } = await supabase.rpc('add_medicine_schedule', {
		param_user_id: user_id,
		param_medicine_json: new_medicine_json,
	});
	if (ScheduleError) throw ScheduleError;
	
	return medicine_id;
}

async function getAllMedicines(user_id) {
	const { data: medicines, error: GetError } = await supabase.rpc('get_all_medicines', { param_user_id: user_id });
	if (GetError) throw GetError;
	return medicines;
}

async function getAllOTCMedicines(user_id) {
	const { data: otc_medicines, error: GetError } = await supabase.rpc('get_all_otc_medicines', { param_user_id: user_id });
	if (GetError) throw GetError;
	return otc_medicines;
}

async function getAllActiveMedicines(user_id) {
	const { data: active_medicines, error: GetError } = await supabase.rpc('get_all_active_medicines', { param_user_id: user_id });
	if (GetError) throw GetError;
	return active_medicines;
}

async function getAllActiveOTCMedicines(user_id) {
	const { data: active_otc_medicines, error: GetError } = await supabase.rpc('get_all_active_otc_medicines', { param_user_id: user_id });
	if (GetError) throw GetError;
	return active_otc_medicines;
}

async function getMedicineWarnedStocks(user_id) {
	const { data: warned_stocks, error: FeatureError } = await supabase.rpc('get_medicine_warned_stocks', { param_user_id: user_id });
	if (FeatureError) throw FeatureError;
	return warned_stocks;
}

async function intakeMedicine(user_id, schedule_id, intake_type, date_scheduled) {
	const { data: intake_log_id, error: FeatureError } = await supabase.rpc('intake_medicine', {
		param_user_id: user_id,
		param_schedule_id: schedule_id,
		param_intake_type: intake_type,
		param_date_scheduled: date_scheduled,
	});
	if (FeatureError) throw FeatureError;
	return intake_log_id;
}

async function missedMedicine(user_id, schedule_id) {
	const { data: json_result, error: FeatureError } = await supabase.rpc('log_medicine_not_taken', {
		param_user_id: user_id,
		param_schedule_id: schedule_id,
	});
	if (FeatureError) throw FeatureError;
	return json_result;
}

async function addMedicineStocks(user_id, medicine_id, add_amount) {
	const { data: new_total, error: FeatureError } = await supabase.rpc('add_medicine_stocks', {
		param_user_id: user_id,
		param_medicine_id: medicine_id,
		param_add_amount: add_amount,
	});
	if (FeatureError) throw FeatureError;
	return new_total;
}

async function subtractMedicineStocks(user_id, medicine_id, subtract_amount) {
	const { data: new_total, error: FeatureError } = await supabase.rpc('subtract_medicine_stocks', {
		param_user_id: user_id,
		param_medicine_id: medicine_id,
		param_add_amount: add_amount,
	});
	if (FeatureError) throw FeatureError;
	return new_total;
}

async function removeMedicine(user_id, medicine_id) {
	const { error: RemoveError } = await supabase.rpc('remove_medicine', {
		param_user_id: user_id,
		param_medicine_id: medicine_id,
	});
	if (RemoveError) throw RemoveError;
	return true;
}

module.exports.addMedicine = addMedicine;
module.exports.getAllMedicines = getAllMedicines;
module.exports.getAllOTCMedicines = getAllOTCMedicines;
module.exports.getAllActiveMedicines = getAllActiveMedicines;
module.exports.getAllActiveOTCMedicines = getAllActiveOTCMedicines;
module.exports.getMedicineWarnedStocks = getMedicineWarnedStocks;
module.exports.intakeMedicine = intakeMedicine;
module.exports.missedMedicine = missedMedicine;
module.exports.addMedicineStocks = addMedicineStocks;
module.exports.subtractMedicineStocks = subtractMedicineStocks;
module.exports.removeMedicine = removeMedicine;

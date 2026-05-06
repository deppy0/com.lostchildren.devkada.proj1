const supabase = require('../database/supabase');

async function addPrescription(user_id, doctor_name, doc_specialization, date_issued, document_url, meds_list) {
	const { data: prescription_id, error: AddError } = await supabase.rpc('add_prescription', {
		param_user_id: user_id,
		param_doctor_name: doctor_name,
		param_doc_specialization: doc_specialization,
		param_date_issued: date_issued,
		param_document_url: document_url,
		param_meds_list: meds_list,
	});
	if (AddError) throw AddError;
	
	const { data: new_meds_list, error: QueryError } = await supabase
		.from('medicines').select('*').eq('prescription_id', prescription_id);
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

async function removePrescription(user_id, prescription_id) {
	const { error: RemoveError } = await supabase.rpc('remove_prescription', {
		param_user_id: user_id,
		param_prescription_id: prescription_id,
	});
	if (RemoveError) throw RemoveError;
	return true;
}

async function uploadPrescriptionImage(user_id, prescriptionId, fileBuffer, originalName, mimeType) {
	// Verify prescription belongs to user
	const { data: prescription, error: fetchError } = await supabase
		.from('prescriptions')
		.select('id')
		.eq('id', prescriptionId)
		.eq('user_id', user_id)
		.single();

	if (fetchError || !prescription) {
		const err = new Error('Prescription not found or does not belong to this user.');
		err.status = 404;
		throw err;
	}

	const fileExt = originalName.split('.').pop();
	const fileName = `${prescriptionId}.${fileExt}`;

	// Upload file to storage
	const { data: storageData, error: storageError } = await supabase.storage
		.from('prescriptions')
		.upload(fileName, fileBuffer, {
			contentType: mimeType,
			upsert: true,
		});

	if (storageError) {
		const err = new Error(`Storage upload failed: ${storageError.message}`);
		err.status = 500;
		throw err;
	}

	// Get public URL
	const { data: publicData } = supabase.storage
		.from('prescriptions')
		.getPublicUrl(fileName);

	const publicUrl = publicData?.publicUrl;
	if (!publicUrl) {
		const err = new Error('Failed to generate public URL.');
		err.status = 500;
		throw err;
	}

	// Update database with image URL
	const { error: dbError } = await supabase
		.from('prescriptions')
		.update({ image_url: publicUrl })
		.eq('id', prescriptionId)
		.eq('user_id', user_id);

	if (dbError) {
		const err = new Error(`Database update failed: ${dbError.message}`);
		err.status = 500;
		throw err;
	}

	return publicUrl;
}

module.exports.addPrescription = addPrescription;
module.exports.getAllPrescriptions = getAllPrescriptions;
module.exports.getAllActivePrescriptions = getAllActivePrescriptions;
module.exports.removePrescription = removePrescription;
module.exports.uploadPrescriptionImage = uploadPrescriptionImage;

const supabase = require('../database/supabase');

async function getTodaySchedule(user_id, date) {
	const { data: schedule, error: ScheduleError } = await supabase.rpc('get_today_schedule', { param_user_id: user_id , param_date: date});
	if (ScheduleError) throw ScheduleError;
	return schedule;
}

module.exports.getTodaySchedule = getTodaySchedule;

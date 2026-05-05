const supabase = require('../database/supabase');

const userSelect = 'id,email,first_name,last_name,guardian_name,guardian_contact,vitals_baseline,meal_times,created_at';
const getUserId = (req) => req.headers['x-user-id'] || req.body?.user_id || req.params?.user_id;

// finds the changes in the fields
const getActualChanges = (currentData, newData, allowedFields) => {
    const updates = {};
    allowedFields.forEach(field => {
        if (newData[field] !== undefined && JSON.stringify(newData[field]) !== JSON.stringify(currentData[field])) {
            updates[field] = newData[field];
        }
    });
    return updates;
};

// find user info based on user id
const getUserInformation = async (req, res) => {
    const user_id = getUserId(req);
    if (!user_id) return res.status(400).json({ message: 'Missing user identification.' });

    const { data: user, error } = await supabase
        .from('users')
        .select(userSelect)
        .eq('id', user_id)
        .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json({ user });
};

// if there is changes in the fields, only updates the fields that got changed
const updateProfile = async (req, res) => {
    const user_id = getUserId(req);
    if (!user_id) return res.status(400).json({ message: 'Missing user identification.' });

    const { data: currentData, error: fetchError } = await supabase
        .from('users')
        .select(userSelect)
        .eq('id', user_id)
        .single();

    if (fetchError) return res.status(500).json({ message: fetchError.message });

    const allowedFields = ['email', 'first_name', 'last_name', 'vitals_baseline', 'meal_times', 'guardian_name', 'guardian_contact'];
    const updates = getActualChanges(currentData, req.body, allowedFields);

    if (Object.keys(updates).length === 0) {
        return res.status(200).json({ user: currentData, message: 'No changes detected.' });
    }

    const { data: user, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user_id)
        .select(userSelect)
        .single();

    if (updateError) return res.status(500).json({ message: updateError.message });
    return res.status(200).json({ user });
};

module.exports = {
    getUserInformation,
    updateProfile
};
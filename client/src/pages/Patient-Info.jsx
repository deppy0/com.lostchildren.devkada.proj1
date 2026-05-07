import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Link } from 'react-router-dom';

export default function PatientInfo() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        breakfast_time: '06:00',
        lunch_time: '12:00',
        dinner_time: '18:00',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updating, setUpdating] = useState(false);

    // Fetch user information on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (!token || !user?.id) {
                    setError('No auth token or user ID found');
                    setLoading(false);
                    return;
                }

                const response = await apiFetch('/server/user/information', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': user.id,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const data = await response.json();
                const userData = data.user;

                setFormData({
                    first_name: userData?.first_name || '',
                    last_name: userData?.last_name || '',
                    breakfast_time: userData?.meal_times?.breakfast || '06:00',
                    lunch_time: userData?.meal_times?.lunch || '12:00',
                    dinner_time: userData?.meal_times?.dinner || '18:00',
                });
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            setError('');
            setSuccess('');
            setUpdating(true);

            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!token || !user?.id) {
                setError('No auth token or user ID found');
                return;
            }

            const response = await apiFetch('/server/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-user-id': user.id,
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    meal_times: {
                        breakfast: formData.breakfast_time,
                        lunch: formData.lunch_time,
                        dinner: formData.dinner_time,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };
    return(
        <div className="max-w-sm mx-auto min-h-full bg-[#F7F9F9] font-k2d pt-10 px-6 pb-28 flex flex-col">
            {/* Header */}
            <div className="relative flex items-center mb-6">
                <div className="absolute left-0 text-[#2081C3] hover:opacity-80 transition-opacity">
                    <Link to="/profile" className="text-[#2081C3] hover:opacity-80 transition-opacity">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Patient</h1>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            {/* Profile Picture Placeholder */}
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <div className="w-24 h-24 bg-[#BED8D4] rounded-full opacity-40"></div>
                    {/* Camera Icon Button */}
                    <button className="absolute bottom-0 right-0 bg-[#2081C3] text-white p-1.5 rounded-full border-2 border-[#F7F9F9] hover:bg-[#63D2FF] transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <h2 className="text-gray-600 text-sm mb-4">Personal information</h2>

            {/* Form Fields */}
            <div className="space-y-5">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>
    
            </div>

            <h2 className="text-gray-600 text-sm mb-4 mt-6">Meal times</h2>

            {/* Meal Time Fields */}
            <div className="space-y-5">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Breakfast Time</label>
                    <input
                        type="time"
                        name="breakfast_time"
                        value={formData.breakfast_time}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Lunch Time</label>
                    <input
                        type="time"
                        name="lunch_time"
                        value={formData.lunch_time}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Dinner Time</label>
                    <input
                        type="time"
                        name="dinner_time"
                        value={formData.dinner_time}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-10 sticky bottom-6 bg-[#F7F9F9]">
                <button 
                    onClick={handleUpdate}
                    disabled={loading || updating}
                    className="w-full bg-[#2081C3] text-white py-3 rounded-xl font-semibold hover:bg-[#63D2FF] disabled:bg-gray-400 transition-colors shadow-sm disabled:cursor-not-allowed"
                >
                    {updating ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
}
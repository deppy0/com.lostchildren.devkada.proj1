import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { Link } from 'react-router-dom';
import careGiverBanner from '../assets/CaregiverBanner.png'

export default function CaregiverInfo() {
    const [formData, setFormData] = useState({
        guardian_name: '',
        guardian_contact: '',
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
                    guardian_name: userData?.guardian_name || '',
                    guardian_contact: userData?.guardian_contact || '',
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
                    guardian_name: formData.guardian_name,
                    guardian_contact: formData.guardian_contact,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setSuccess('Caregiver information updated successfully!');
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
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Caregiver</h1>
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

            {/* Illustration Placeholder */}
            <div className="flex justify-center mb-8">
                <img className="w-50 h-50" src={careGiverBanner} alt="careGiverBanner"></img>
            </div>

            <h2 className="text-gray-600 text-sm mb-4">Caregiver Information</h2>

            {/* Form Fields */}
            <div className="space-y-5">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Name</label>
                    <input
                        type="text"
                        name="guardian_name"
                        value={formData.guardian_name}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Contact</label>
                    <input
                        type="text"
                        name="guardian_contact"
                        value={formData.guardian_contact}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700 disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
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
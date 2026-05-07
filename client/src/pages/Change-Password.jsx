import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const nav = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async () => {
        setError('');
        setSuccess('');

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (oldPassword === newPassword) {
            setError('New password must be different from old password');
            return;
        }

        setLoading(true);

        try {
            const token = sessionStorage.getItem('authToken');
            const userString = sessionStorage.getItem('user');
            
            if (!token) {
                setError('Not authenticated. Please login first.');
                setLoading(false);
                return;
            }

            if (!userString) {
                setError('User data not found. Please login again.');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userString);
            const userEmail = user?.email;

            if (!userEmail) {
                setError('User email not found');
                setLoading(false);
                return;
            }

            // Verify old password by attempting to login with retrieved email and old password
            const loginResponse = await fetch('/server/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: oldPassword,
                }),
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                setError('Old password is incorrect');
                setLoading(false);
                return;
            }

            // Old password verified, now change the password
            const response = await fetch('/server/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to change password');
            } else {
                setSuccess('Password changed successfully');
                
                // Logout user after password change
                try {
                    const token = sessionStorage.getItem('authToken');
                    await fetch('/server/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                } catch (err) {
                    console.error('Logout error:', err);
                }
                
                // Clear sessionStorage and redirect to login
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
                
                // Redirect after showing success message
                setTimeout(() => {
                    nav('/');
                }, 2000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Password change error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto min-h-full bg-[#F7F9F9] font-k2d pt-10 px-6 pb-28 flex flex-col">
            {/* Header */}
            <div className="relative flex items-center mb-8">
                <div className="absolute left-0 text-[#2081C3] hover:opacity-80 transition-opacity">
                    <Link to="/profile" className="text-[#2081C3] hover:opacity-80 transition-opacity">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Password</h1>
            </div>

            <h2 className="text-gray-600 text-sm mb-6">Change Password</h2>

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

            {/* Form Fields */}
            <div className="space-y-6">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-10 sticky bottom-6 bg-[#F7F9F9]">
                <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full bg-[#2081C3] text-white py-3 rounded-xl font-semibold hover:bg-[#63D2FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
}
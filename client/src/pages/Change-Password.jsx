import React from 'react';
import { Link } from 'react-router-dom';

export default function ChangePassword() {
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

            {/* Form Fields */}
            <div className="space-y-6">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Old Password</label>
                    <input
                        type="password"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">New Password</label>
                    <input
                        type="password"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-10 sticky bottom-6 bg-[#F7F9F9]">
                <button className="w-full bg-[#2081C3] text-white py-3 rounded-xl font-semibold hover:bg-[#63D2FF] transition-colors shadow-sm">
                    Update
                </button>
            </div>
        </div>
    );
}
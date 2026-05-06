import React from 'react';

export default function ChangePassword() {
    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button className="text-[#2081C3] text-xl font-semibold hover:text-[#63D2FF]">&lt;</button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Password</h1>
            </div>

            <h2 className="text-gray-600 text-sm mb-6">Change Password</h2>

            {/* Form Fields */}
            <div className="space-y-6 flex-1">
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
            <button className="w-full bg-[#2081C3] text-white py-3 rounded-xl mt-8 font-semibold hover:bg-[#63D2FF] transition-colors shadow-sm">
                Update
            </button>
        </div>
    );
}
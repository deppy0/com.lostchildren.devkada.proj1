import React from 'react';

export default function CaregiverInfo() {
    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button className="text-[#2081C3] text-xl font-semibold hover:text-[#63D2FF]">&lt;</button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Caregiver</h1>
            </div>

            {/* Illustration Placeholder */}
            <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-[#BED8D4] rounded-lg flex items-center justify-center opacity-50">
                    <span className="text-xs text-gray-600">Illustration</span>
                </div>
            </div>

            <h2 className="text-gray-600 text-sm mb-4">Caregiver Information</h2>

            {/* Form Fields */}
            <div className="space-y-5 flex-1">
                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">First Name</label>
                    <input
                        type="text"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Last Name</label>
                    <input
                        type="text"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>

                <div className="relative">
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Email</label>
                    <input
                        type="email"
                        className="w-full bg-transparent border border-[#BED8D4] rounded-xl p-3 text-sm outline-none focus:border-[#78D5D7] text-gray-700"
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm">&#9998;</span>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#2081C3] text-white py-3 rounded-xl mt-8 font-semibold hover:bg-[#63D2FF] transition-colors shadow-sm">
                Update
            </button>
        </div>
    );
}
import React from 'react';

export default function PatientInfo() {
    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button className="text-[#2081C3] text-xl font-semibold hover:text-[#63D2FF]">&lt;</button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Patient</h1>
            </div>

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
                    <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#F7F9F9] px-1">Contact Number</label>
                    <input
                        type="tel"
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
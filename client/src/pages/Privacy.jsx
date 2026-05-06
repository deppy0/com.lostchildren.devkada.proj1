import React from 'react';

export default function Privacy() {
    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button className="text-[#2081C3] text-xl font-semibold hover:text-[#63D2FF]">&lt;</button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Privacy</h1>
            </div>

            <h2 className="text-gray-600 text-sm mb-6">Privacy Statement</h2>

            {/* Statement Text */}
            <div className="flex-1">
                <p className="text-[11px] text-gray-500 leading-relaxed text-justify tracking-wide">
                    Medimed is a MVP application that scans prescription and inputs in automatically
                    inside the application system. Since the app is still experimental, the developers
                    are not liable for any misuse or unexpected bugs that might be present.
                </p>
            </div>
        </div>
    );
}
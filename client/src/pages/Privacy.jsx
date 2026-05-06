import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="relative flex items-center mb-8">
                <div className="absolute left-0 text-[#2081C3] hover:opacity-80 transition-opacity">
                    <Link to="/profile" className="text-[#2081C3] hover:opacity-80 transition-opacity">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>
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
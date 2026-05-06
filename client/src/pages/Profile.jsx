import React from 'react';

// Reusable Menu Item Component
function MenuItem({ icon, label, actionIcon }) {
    return (
        <div className="flex items-center justify-between py-3 px-2 border-b border-[#F7F9F9]/30 last:border-0">
            <div className="flex items-center gap-3 text-gray-700">
                <span className="w-5 h-5">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-gray-700 w-4 h-4">{actionIcon}</span>
        </div>
    );
}

export default function Profile() {
    // SVGs for Icons
    const Icons = {
        user: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        lock: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        bell: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        question: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        logout: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ),
        edit: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
        chevron: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        ),
        home: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    };

    return (
        <div className="max-w-sm mx-auto h-[800px] bg-[#F7F9F9] font-k2d relative flex flex-col overflow-hidden shadow-lg border border-gray-200">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-28 px-6 pt-10">

                {/* Title */}
                <h1 className="text-center text-2xl font-semibold tracking-widest text-black mb-8">PROFILE</h1>

                {/* Profile Details */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-28 h-28 bg-[#d1d5db] rounded-full mb-3 opacity-50"></div>
                    <h2 className="text-lg font-semibold text-black">Kurt Anjo Laguerta</h2>
                    <p className="text-xs text-gray-500 font-light tracking-wider">09676767676</p>
                </div>

                {/* Profile Information Section */}
                <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2 px-1">Profile Information</p>
                    <div className="bg-[#BED8D4] rounded-2xl p-3 shadow-sm">
                        <MenuItem icon={Icons.user} label="Patient" actionIcon={Icons.edit} />
                        <MenuItem icon={Icons.user} label="Caregiver" actionIcon={Icons.edit} />
                        <MenuItem icon={Icons.lock} label="Password" actionIcon={Icons.edit} />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2 px-1">Settings</p>
                    <div className="bg-[#BED8D4] rounded-2xl p-3 shadow-sm">
                        <MenuItem icon={Icons.bell} label="Notification" actionIcon={Icons.chevron} />
                        <MenuItem icon={Icons.question} label="Privacy" actionIcon={Icons.chevron} />
                        <MenuItem icon={Icons.logout} label="Logout" actionIcon={Icons.chevron} />
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="absolute bottom-20 right-6 w-14 h-14 bg-[#78D5D7] rounded-full flex items-center justify-center text-white text-3xl font-light shadow-lg hover:bg-[#63D2FF] transition-colors z-10">
                +
            </button>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 w-full h-16 bg-[#2081C3] rounded-t-[1.5rem] flex items-center justify-around px-8 z-20">
                {/* Home Nav Item */}
                <button className="w-12 h-12 bg-[#78D5D7] rounded-xl flex items-center justify-center text-white hover:bg-[#63D2FF] transition-colors">
                    <span className="w-7 h-7">{Icons.home}</span>
                </button>
                {/* Profile Nav Item */}
                <button className="w-12 h-12 flex items-center justify-center text-white hover:text-gray-200 transition-colors">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
            </div>

        </div>
    );
}
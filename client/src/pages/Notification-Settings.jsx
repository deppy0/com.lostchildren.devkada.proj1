import React, { useState } from 'react';

// Reusable Toggle Switch Component
function Toggle({ label, enabled, onChange }) {
    return (
        <div className="flex items-center justify-between py-4">
            <span className="text-xs text-gray-600">{label}</span>
            <button
                onClick={onChange}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out ${
                    enabled ? 'bg-[#63D2FF]' : 'bg-[#BED8D4]'
                }`}
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${
                        enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}

export default function NotificationSettings() {
    const [appNotif, setAppNotif] = useState(true);
    const [emailNotif, setEmailNotif] = useState(true);
    const [caregiverNotif, setCaregiverNotif] = useState(true);

    return (
        <div className="max-w-sm mx-auto min-h-screen bg-[#F7F9F9] font-k2d p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button className="text-[#2081C3] text-xl font-semibold hover:text-[#63D2FF]">&lt;</button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800">Notification</h1>
            </div>

            <h2 className="text-gray-600 text-sm mb-4">Notification Settings</h2>

            {/* Toggles */}
            <div className="space-y-2 mt-4 flex-1">
                <Toggle
                    label="App notifications"
                    enabled={appNotif}
                    onChange={() => setAppNotif(!appNotif)}
                />
                <Toggle
                    label="Email notifications"
                    enabled={emailNotif}
                    onChange={() => setEmailNotif(!emailNotif)}
                />
                <Toggle
                    label="Caregiver Email notifications"
                    enabled={caregiverNotif}
                    onChange={() => setCaregiverNotif(!caregiverNotif)}
                />
            </div>
        </div>
    );
}
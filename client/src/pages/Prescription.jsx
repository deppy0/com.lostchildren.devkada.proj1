import { useState } from 'react';
import '../css/Font.css';
import '../css/Prescription.css';

export default function Prescription() {
    // Tracks the toggle switch state ('current' or 'history')
    const [view, setView] = useState('current');

    // Sample data for multiple prescriptions with all grouped information
    const initialPrescriptionsList = [
        {
            id: '#1',
            status: 'Active',
            doctorName: 'Karin Ann Hernandez-Lim M.D.',
            department: 'Internal Medicine Nephrology',
            license: 'No. 110564',
            ptr: '11049674',
            dateIssued: 'May 06, 2025',
            medicines: [
                { id: 1, name: 'Paracetamol', format: 'tablet #100', instruction: '1 tablet once a day in AM', dosage: '500mg' },
                { id: 2, name: 'Amoxicillin', format: 'tablet #100', instruction: '1 tablet twice a day', dosage: '250mg' },
                { id: 3, name: 'Ibuprofen', format: 'tablet #100', instruction: '1 tablet as needed', dosage: '200mg' },
            ],
        },
        {
            id: '#2',
            status: 'Active',
            doctorName: 'Dr. John Martinez M.D.',
            department: 'Cardiology',
            license: 'No. 110565',
            ptr: '11049675',
            dateIssued: 'May 01, 2025',
            medicines: [
                { id: 1, name: 'Metoprolol', format: 'tablet #100', instruction: '1 tablet once a day in AM', dosage: '50mg' },
                { id: 2, name: 'Lisinopril', format: 'tablet #100', instruction: '1 tablet once a day in PM', dosage: '10mg' },
            ],
        },
        {
            id: '#3',
            status: 'Active',
            doctorName: 'Dr. Maria Santos M.D.',
            department: 'Dermatology',
            license: 'No. 110566',
            ptr: '11049676',
            dateIssued: 'April 20, 2025',
            medicines: [
                { id: 1, name: 'Fluconazole', format: 'capsule #100', instruction: '1 capsule once a day', dosage: '150mg' },
            ],
        },
    ];

    // Sample data for the history list
    const initialHistoryList = [
        { id: '#67', date: 'May 06, 2026', doctor: 'Karin Ann Hernandez-Lim M.D.', spec: 'Internal Medicine Nephrology' },
        { id: '#67', date: 'May 06, 2026', doctor: 'Karin Ann Hernandez-Lim M.D.', spec: 'Internal Medicine Nephrology' },
    ];

    const [currentPrescriptions, setCurrentPrescriptions] = useState(initialPrescriptionsList);
    const [historyList, setHistoryList] = useState(initialHistoryList);

    const movePrescriptionToHistory = (prescription) => {
        setCurrentPrescriptions((previousPrescriptions) =>
            previousPrescriptions.filter((item) => item.id !== prescription.id)
        );

        setHistoryList((previousHistory) => [
            {
                id: prescription.id,
                date: prescription.dateIssued,
                doctor: prescription.doctorName,
                spec: prescription.department,
            },
            ...previousHistory,
        ]);
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F9] relative pb-32 font-k2d text-gray-900 overflow-x-hidden">

            {/* --- Header Section --- */}
            <div className="pt-12 px-6">
                <h1 className="text-3xl font-semibold text-center mb-6">
                    Prescription Record
                </h1>

                {/* --- Toggle Switch --- */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-[#E5E7EB] rounded-full border border-gray-400 p-0.5 w-60">
                        <button
                            onClick={() => setView('current')}
                            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                view === 'current'
                                    ? 'bg-[#2081C3] text-white shadow-sm'
                                    : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            Current
                        </button>
                        <button
                            onClick={() => setView('history')}
                            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                view === 'history'
                                    ? 'bg-[#2081C3] text-white shadow-sm'
                                    : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            History
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Content Area --- */}
            <div className="px-4">

                {/* 1. CURRENT VIEW */}
                {view === 'current' && (
                    <div className="view-content space-y-5">
                        {currentPrescriptions.map((prescription, idx) => (
                            <div key={idx} className="bg-[#63D2FF] bg-opacity-80 rounded-3xl border border-cyan-200 overflow-hidden">

                                <div className="bg-[#86DDF8] px-5 pt-5 pb-4">
                                    {/* Title & Status */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold">Prescription {prescription.id}</h2>
                                        {prescription.status === 'Active' ? (
                                            <button
                                                type="button"
                                                onClick={() => movePrescriptionToHistory(prescription)}
                                                className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#4ADE80] active:scale-95 transition-transform shadow-sm"
                                            >
                                                Active
                                            </button>
                                        ) : (
                                            <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-gray-400">
                                                {prescription.status}
                                            </span>
                                        )}
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-[15px]">{prescription.doctorName}</p>
                                            <p className="text-xs text-gray-700">{prescription.department}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">

                                {/* View Picture Button */}
                                <div className="flex justify-center mb-6">
                                    <button className="bg-[#2081C3] text-white text-sm font-semibold py-2 px-6 rounded-full flex items-center gap-2 shadow-sm active:scale-95 transition-transform">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        View Picture
                                    </button>
                                </div>

                                {/* Medications List */}
                                <div className="space-y-3 mb-6">
                                    {prescription.medicines.map((med, index) => (
                                        <div key={index} className="bg-[#78D5D7] bg-opacity-40 rounded-xl border border-gray-400 overflow-hidden">
                                            <div className="text-center font-bold text-[15px] py-1 border-b border-gray-400">
                                                {med.name}
                                            </div>
                                            <div className="bg-[#F7F9F9] flex justify-between items-center px-3 py-2 text-[10px]">
                                                <span className="text-gray-500">{med.format}</span>
                                                <span className="font-bold text-black text-xs">{med.instruction}</span>
                                                <span className="text-gray-500">{med.dosage}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                    {/* Footer Date */}
                                    <div className="text-center text-[11px] text-gray-700 mt-4">
                                        Issued: {prescription.dateIssued}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. HISTORY VIEW */}
                {view === 'history' && (
                    <div className="view-content space-y-4">
                        {historyList.map((item, index) => (
                            <div key={index} className="bg-[#63D2FF] bg-opacity-70 rounded-2xl overflow-hidden">
                                <div className="bg-[#86DDF8] px-4 py-2">
                                    {/* Top Row: ID and Date */}
                                    <div className="flex justify-between items-center text-[11px] text-gray-600">
                                        <span>ID {item.id}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Bottom Row: Doctor Info & Button */}
                                    <div className="flex justify-between items-end mt-1">
                                        <div>
                                            <p className="font-bold text-[14px] leading-tight text-black">{item.doctor}</p>
                                            <p className="text-[10px] text-gray-700">{item.spec}</p>
                                        </div>
                                        <button className="bg-[#2081C3] text-white text-xs font-semibold py-1.5 px-4 rounded-full shadow-sm active:scale-95 transition-transform">
                                            View Picture
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
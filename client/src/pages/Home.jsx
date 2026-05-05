import { useState } from 'react';
import Nav from './Nav.jsx';
import '../css/Home.css';
import '../css/Font.css';

export default function Home() {
    const [activeTab, setActiveTab] = useState('home');

    // Sample data to make rendering cleaner
    const weekDays = [
        { day: 'Mon', date: '4', active: true },
        { day: 'Tue', date: '5', active: false },
        { day: 'Wed', date: '6', active: false },
        { day: 'Thu', date: '7', active: false },
        { day: 'Fri', date: '8', active: false },
        { day: 'Sat', date: '9', active: false },
        { day: 'Sun', date: '10', active: false },
    ];

    const medications = [
        { id: 1, name: 'Meth', instruction: 'Take before eating', dosage: '20mg', time: '8:00 am', inventory: '200mg' },
        { id: 2, name: 'Meth', instruction: 'Take before eating', dosage: '20mg', time: '8:00 am', inventory: '200mg' },
    ];

    return (
        // Main Container: Constrained width for mobile view, gray background
        <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F9] relative pb-28 font-k2d text-gray-900 overflow-x-hidden">

            {/* --- Header / Calendar --- */}
            <div className="flex items-center justify-between px-2 pt-8">
                {/* Left Arrow */}
                <button className="text-[#2081C3] p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                {/* Days */}
                <div className="flex gap-2">
                    {weekDays.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-11 h-16 rounded-[25px] flex flex-col items-center justify-center border border-[#000000] ${item.active ? 'bg-[#2081C3]/75' : 'bg-[#63D2FF]/50'}`}>
                                <span className="text-xs font-k2d font-extralight leading-tight">{item.day}</span>
                                <div className="w-6 h-6 rounded-full bg-[#78D5D7]/75 flex items-center justify-center border border-[#000000] mt-1">
                                    <span className="text-sm font-k2d font-semibold">{item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button className="text-[#2081C3] p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>

            {/* --- Date Title --- */}
            <h1 className="text-[2.5rem] font-k2d font-semibold text-center mt-6 mb-8 tracking-tight text-[#2081C3]">
                Monday, May 4
            </h1>

            {/* --- Progress Section --- */}
            <div className="flex items-center justify-center gap-6 mb-8 pl-4">
                {/* Circular Progress (Using SVG) */}
                <div className="relative w-32 h-32">
                    {/* Background Track */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#BED8D4" strokeWidth="20" />
                        {/* Progress Arc (80% complete for 4/5) */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2081C3" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-k2d font-semibold text-[#2081C3]">4 of 5</span>
                    </div>
                </div>

                {/* Progress Text */}
                <div className="flex flex-col justify-center max-w-[140px]">
                    <span className="text-2xl font-k2d font-semibold leading-tight text-[#2081C3]">Medications</span>
                    <span className="text-2xl font-k2d font-semibold leading-tight text-[#2081C3]">Taken Today</span>
                </div>
            </div>

            {/* --- Medication Cards --- */}
            <div className="px-4 space-y-4">
                {medications.map((med) => (
                    <div key={med.id} className="bg-[#63D2FF]/80 rounded-2xl p-4 shadow-sm border border-[#2081C3] overflow-hidden">

                        {/* Top Row: Info & Actions */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Square Checkbox Placeholder */}
                                <div className="w-10 h-10 bg-[#BED8D4] rounded-lg border border-[#2081C3]"></div>
                                <div>
                                    <h3 className="text-2xl font-k2d font-semibold leading-none text-[#000000]">{med.name}</h3>
                                    <p className="text-sm font-k2d font-extralight text-gray-700">{med.instruction}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-[10px] bg-[#F7F9F9] flex items-center justify-center border border-red-500">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                <button className="w-8 h-8 rounded-[10px] bg-[#F7F9F9] flex items-center justify-center border border-[#2081C3]">
                                    <svg className="w-5 h-5 text-[#2081C3]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row: Stats */}
                        <div className="bg-[#63D2FF]/75 rounded-b-2xl -mx-4 -mb-4 p-4 grid grid-cols-4 text-center gap-2">
                            <div className="col-span-1 flex flex-col">
                                <span className="text-sm font-k2d font-extralight text-[#2081C3]">Dosage</span>
                                <span className="font-k2d font-semibold text-gray-700">{med.dosage}</span>
                            </div>
                            <div className="col-span-3 grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-k2d font-extralight text-[#2081C3]">Time</span>
                                    <span className="font-k2d font-semibold text-gray-700">{med.time}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-k2d font-extralight text-[#2081C3]">Inventory</span>
                                    <span className="font-k2d font-semibold text-sm leading-tight text-gray-700">{med.inventory}<br/>remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pass activeTab and setActiveTab to Nav */}
            <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
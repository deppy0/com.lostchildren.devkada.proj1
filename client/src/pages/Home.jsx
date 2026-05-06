import { useState, useEffect } from 'react';
import '../css/Home.css';
import '../css/Font.css';

export default function Home() {
    const [medications, setMedications] = useState([
        { id: 1, name: 'Meth', instruction: 'Take before eating', dosage: '20mg', time: '8:00 am', inventory: '200mg', status: 'pending' },
        { id: 2, name: 'Meth', instruction: 'Take before eating', dosage: '20mg', time: '8:00 am', inventory: '200mg', status: 'pending' },
    ]);

    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDateOffset, setSelectedDateOffset] = useState(0);

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWeekOffset(0);
        setSelectedDateOffset(todayIndex);
    }, []);

    useEffect(() => {
        if (weekOffset === 0) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedDateOffset(todayIndex);
        }
    }, [weekOffset]);

    const updateMedStatus = (id, newStatus) => {
        setMedications(prevMeds =>
            prevMeds.map(med =>
                med.id === id
                    ? { ...med, status: med.status === newStatus ? 'pending' : newStatus }
                    : med
            )
        );
    };

    const getWeekDays = (offset) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + mondayOffset + offset * 7 + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
            const dayDate = date.getDate();
            const isToday = date.toDateString() === today.toDateString();

            weekDays.push({ day: dayName, date: dayDate, active: isToday });
        }
        return weekDays;
    };

    const getSelectedDate = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const selectedDate = new Date(today);
        selectedDate.setDate(selectedDate.getDate() + mondayOffset + weekOffset * 7 + selectedDateOffset);
        return selectedDate;
    };

    const weekDays = getWeekDays(weekOffset);
    const displayDate = getSelectedDate();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F9] relative pb-28 font-k2d text-gray-900 overflow-x-hidden">

            {/* --- Header / Calendar --- */}
            <div className="flex items-center justify-between px-2 pt-8">
                <button onClick={() => setWeekOffset(weekOffset - 1)} className="text-[#2081C3] p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <div className="flex gap-2">
                    {weekDays.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDateOffset(index)}
                            className="flex flex-col items-center"
                        >
                            <div className={`w-10 h-16 rounded-[25px] flex flex-col items-center justify-center border border-[#000000] transition-colors ${selectedDateOffset === index ? 'bg-[#2081C3]/75' : 'bg-[#63D2FF]/50'}`}>
                                <span className="text-xs font-k2d font-extralight leading-tight">{item.day}</span>
                                <div className="w-6 h-6 rounded-full bg-[#78D5D7]/75 flex items-center justify-center border border-[#000000] mt-1">
                                    <span className="text-sm font-k2d font-semibold">{item.date}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <button onClick={() => setWeekOffset(weekOffset + 1)} className="text-[#2081C3] p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>

            {/* --- Date Title --- */}
            {(() => {
                const dayName = displayDate.toLocaleDateString('en-US', { weekday: 'long' });
                const monthName = displayDate.toLocaleDateString('en-US', { month: 'long' });
                const date = displayDate.getDate();

                return (
                    <h1 className="text-[2.5rem] font-k2d font-semibold text-center mt-6 mb-8 tracking-tight text-[#2081C3]">
                        {dayName}, {monthName} {date}
                    </h1>
                );
            })()}

            {/* --- Progress Section --- */}
            <div className="flex items-center justify-center gap-6 mb-8 pl-4">
                <div className="relative w-32 h-32">
                    {(() => {
                        const total = medications.length;
                        const taken = medications.filter(med => med.status === 'taken').length;
                        const percentage = total > 0 ? (taken / total) * 100 : 0;
                        const circumference = 251.2;
                        const strokeDashoffset = circumference - (circumference * percentage) / 100;

                        return (
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#BED8D4" strokeWidth="20" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#2081C3"
                                    strokeWidth="20"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="progress-circle"
                                />
                            </svg>
                        );
                    })()}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-k2d font-semibold text-[#2081C3]">
                            {medications.filter(med => med.status === 'taken').length} of {medications.length}
                        </span>
                    </div>
                </div>

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
                                <div className={`w-10 h-10 rounded-lg border border-[#2081C3] transition-colors duration-300 ${med.status === 'taken' ? 'bg-[#2081C3]' : med.status === 'missed' ? 'bg-red-400 border-red-500' : 'bg-[#BED8D4]'}`}></div>
                                <div>
                                    <h3 className="text-2xl font-k2d font-semibold leading-none text-[#000000]">{med.name}</h3>
                                    <p className="text-sm font-k2d font-extralight text-gray-700">{med.instruction}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">

                                {(med.status === 'pending' || med.status === 'not_taken') && (
                                    <button
                                        onClick={() => updateMedStatus(med.id, 'not_taken')}
                                        className={`group flex items-center justify-center h-8 rounded-[10px] bg-[#F7F9F9] border border-red-500 transition-all duration-300 ease-in-out overflow-hidden ${
                                            med.status === 'not_taken' ? 'w-24' : 'w-8 hover:w-24'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        <span className={`text-red-600 font-k2d font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-in-out ${
                                            med.status === 'not_taken' ? 'max-w-[80px] ml-1 opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:ml-1 group-hover:opacity-100'
                                        }`}>
                                            Not Taken
                                        </span>
                                    </button>
                                )}

                                {(med.status === 'pending' || med.status === 'taken') && (
                                    <button
                                        onClick={() => updateMedStatus(med.id, 'taken')}
                                        className={`group flex items-center justify-center h-8 rounded-[10px] bg-[#F7F9F9] border border-[#2081C3] transition-all duration-300 ease-in-out overflow-hidden ${
                                            med.status === 'taken' ? 'w-24' : 'w-8 hover:w-24'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 text-[#2081C3] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span className={`text-[#2081C3] font-k2d font-semibold text-sm whitespace-nowrap transition-all duration-300 ease-in-out ${
                                            med.status === 'taken' ? 'max-w-[30px] ml-1 opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[30px] group-hover:ml-1 group-hover:opacity-100'
                                        }`}>
                                            Taken
                                        </span>
                                    </button>
                                )}

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
        </div>
    );
}
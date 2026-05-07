import { useState, useEffect } from 'react';
import '../css/Home.css';
import '../css/Font.css';
import { apiFetch, API_BASE } from '../lib/api';

const API_BASE_URL = API_BASE || '/server';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

// Helper to format time strictly
const formatTime = (timeData) => {
    if (!timeData) return '--:--';
    if (Array.isArray(timeData)) {
        return timeData.map(t => formatSingleTime(t)).join(', ');
    }
    if (typeof timeData === 'string' && timeData.includes(',')) {
        return timeData.split(',').map(t => formatSingleTime(t.trim())).join(', ');
    }
    return formatSingleTime(timeData);
};

const formatSingleTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr.startsWith('With')) return timeStr;
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let hour = parseInt(parts[0], 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${parts[1]} ${ampm}`;
};

const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const timeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;

    // Handle meal-based instructions by assigning them approximate sorting weights
    const lowerTime = timeStr.toLowerCase();
    if (lowerTime.includes('breakfast')) return 480; // 8:00 AM
    if (lowerTime.includes('lunch')) return 720;     // 12:00 PM
    if (lowerTime.includes('dinner')) return 1080;   // 6:00 PM

    // Standard time parsing (e.g., "08:30 AM")
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;

    let [_, hours, minutes, modifier] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

export default function Home() {
    const [medications, setMedications] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDateOffset, setSelectedDateOffset] = useState(0);

    const getSelectedDate = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const selectedDate = new Date(today);
        selectedDate.setDate(selectedDate.getDate() + mondayOffset + weekOffset * 7 + selectedDateOffset);
        return selectedDate;
    };

    const displayDate = getSelectedDate();
    const displayDateString = getLocalISODate(displayDate);

    const fetchSchedule = async () => {
        try {
            const [scheduleResponse, inventoryResponse] = await Promise.all([
                apiFetch('/server/schedule/today', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ date: displayDateString })
                }),
                apiFetch('/server/medicine/get', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({})
                })
            ]);

            const scheduleData = await scheduleResponse.json();
            const inventoryData = await inventoryResponse.json();

            if (!scheduleResponse.ok) throw new Error(scheduleData.error || `HTTP error ${scheduleResponse.status}`);

            if (scheduleData.success && scheduleData.schedule) {
                const allMedicines = (inventoryData.success && inventoryData.medicines) ? inventoryData.medicines : [];

                // 1. Map Initial Data
                const formattedMeds = scheduleData.schedule.map(item => {
                    const matchingMed = allMedicines.find(m => m.id === item.medicine_id) || {};
                    return {
                        id: item.schedule_id,
                        medicine_id: item.medicine_id,
                        name: item.medicine_name || 'Unknown Medicine',
                        dosage: item.strength || '-',
                        time: formatTime(item.scheduled_time),
                        status: item.intake_status?.toLowerCase() || 'pending',
                        instruction: item.taken_at_meals ? 'Take at meals' : (matchingMed.medicine_type || 'Take as directed'),
                        inventory: matchingMed.stock_remaining ?? 0,
                        iconColor: matchingMed.color || 'bg-[#FFDFBA]',
                        // Ensure we grab these for expansion calculation
                        hourly_gap: item.hourly_gap || matchingMed.hourly_gap,
                        max_per_day: item.max_per_day || matchingMed.max_per_day
                    };
                });

                // 2. Expand into Multiple Instances if required
                const expandedMeds = [];

                formattedMeds.forEach((med) => {
                    // Scenario A: Gap-based multiple doses
                    if (med.hourly_gap && med.max_per_day > 1) {
                        const baseTimeStr = med.time || '08:00 AM';
                        let [timePart, modifier] = baseTimeStr.split(' ');
                        let [hours, minutes] = timePart.split(':').map(Number);

                        if (modifier === 'PM' && hours !== 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;

                        for (let i = 0; i < med.max_per_day; i++) {
                            let currentHour = Math.floor(hours + (i * med.hourly_gap)) % 24;
                            let ampm = currentHour >= 12 ? 'PM' : 'AM';
                            let displayHour = currentHour % 12 || 12;
                            let displayTime = `${displayHour}:${(minutes || 0).toString().padStart(2, '0')} ${ampm}`;

                            expandedMeds.push({
                                ...med,
                                time: displayTime,
                                unique_id: `${med.id}_gap_${i}` // Unique React Key
                            });
                        }
                    }
                    // Scenario B: Comma-separated array/string from DB (e.g. "8:00 AM, 2:00 PM")
                    else if (med.time && med.time.includes(',')) {
                        const times = med.time.split(',');
                        times.forEach((t, i) => {
                            expandedMeds.push({
                                ...med,
                                time: t.trim(),
                                unique_id: `${med.id}_csv_${i}`
                            });
                        });
                    }
                    // Scenario C: Standard single dose
                    else {
                        expandedMeds.push({ ...med, unique_id: `${med.id}_single` });
                    }
                });

                const sortedMeds = expandedMeds.sort((a, b) => {
                    const timeA = timeToMinutes(a.time);
                    const timeB = timeToMinutes(b.time);

                    if (timeA !== timeB) {
                        return timeA - timeB;
                    }
                    // Secondary sort by name if times are identical
                    return a.name.localeCompare(b.name);
                });

                setMedications(sortedMeds);
            } else {
                setMedications([]);
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        }
    };

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        setWeekOffset(0);
        setSelectedDateOffset(todayIndex);
    }, []);

    useEffect(() => {
        if (weekOffset === 0) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            setSelectedDateOffset(todayIndex);
        }
    }, [weekOffset]);

    useEffect(() => {
        fetchSchedule();
    }, [displayDateString]);

    const updateMedStatus = async (uniqueId, newStatus) => {
        // Find the specific card instance by uniqueId
        const targetMed = medications.find(m => m.unique_id === uniqueId);
        if (!targetMed || targetMed.status !== 'pending') return;

        try {
            const res = await apiFetch('/server/medicine/intake', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    schedule_id: targetMed.id, // Still send the real backend ID
                    intake_type: newStatus,
                    date_scheduled: displayDateString,
                    logged_time: targetMed.time // Optional: send specific instance time if backend supports it
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Failed to log status");

            if (newStatus === 'taken') {
                await apiFetch('/server/medicine/subtract-stocks', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ medicine_id: targetMed.medicine_id, subtract_amount: 1 })
                });
            }

            // Update only the specific card in UI state
            setMedications(prevMeds =>
                prevMeds.map(med => {
                    if (med.unique_id === uniqueId) {
                        let newInventory = med.inventory;
                        if (newStatus === 'taken') newInventory -= 1;
                        return { ...med, status: newStatus, inventory: newInventory };
                    }
                    return med;
                })
            );
        } catch (error) {
            console.error("Error updating medication status:", error);
            alert(`Failed to update status: ${error.message}`);
        }
    };

    const weekDays = (() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + mondayOffset + weekOffset * 7 + i);
            days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3),
                date: date.getDate()
            });
        }
        return days;
    })();

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F9] relative pb-28 font-k2d text-gray-900 overflow-x-hidden">
            {/* Header / Responsive Calendar */}
            <div className="flex items-center justify-between px-2 pt-8 w-full">
                <button onClick={() => setWeekOffset(weekOffset - 1)} className="text-[#2081C3] p-1 sm:p-2 shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div className="flex flex-1 justify-between items-center px-1 sm:px-2 max-w-[340px] mx-auto">
                    {weekDays.map((item, index) => (
                        <button key={index} onClick={() => setSelectedDateOffset(index)} className="flex flex-col items-center">
                            <div className={`w-9 sm:w-10 h-14 sm:h-16 rounded-[25px] flex flex-col items-center justify-center border border-[#000000] transition-colors ${selectedDateOffset === index ? 'bg-[#2081C3]/75' : 'bg-[#63D2FF]/50'}`}>
                                <span className="text-[10px] sm:text-xs font-extralight leading-tight">{item.day}</span>
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#78D5D7]/75 flex items-center justify-center border border-[#000000] mt-0.5 sm:mt-1">
                                    <span className="text-[10px] sm:text-sm font-semibold">{item.date}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setWeekOffset(weekOffset + 1)} className="text-[#2081C3] p-1 sm:p-2 shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>

            <h1 className="text-[2.5rem] font-semibold text-center mt-6 mb-8 tracking-tight text-[#2081C3]">
                {displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h1>

            {/* Progress Section */}
            <div className="flex items-center justify-center gap-6 mb-8 pl-4">
                <div className="relative w-32 h-32">
                    {(() => {
                        const total = medications.length;
                        const taken = medications.filter(m => m.status === 'taken').length;
                        const percentage = total > 0 ? (taken / total) * 100 : 0;
                        return (
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#BED8D4" strokeWidth="20" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2081C3" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * percentage) / 100} strokeLinecap="round" className="transition-all duration-500" />
                            </svg>
                        );
                    })()}
                    <div className="absolute inset-0 flex items-center justify-center font-semibold text-[#2081C3]">
                        {medications.filter(m => m.status === 'taken').length} of {medications.length}
                    </div>
                </div>
                <div className="flex flex-col text-[#2081C3] text-2xl font-semibold leading-tight">
                    <span>Medications</span><span>Taken Today</span>
                </div>
            </div>

            {/* Medication Cards */}
            <div className="px-4 space-y-4">
                {medications.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 font-light">No medications scheduled.</div>
                ) : (
                    medications.map((med) => (
                        <div key={med.unique_id} className="bg-[#63D2FF]/80 rounded-2xl p-4 shadow-sm border border-[#2081C3] overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg border border-[#2081C3] ${med.status === 'taken' ? 'bg-[#2081C3]' : med.status === 'not taken' ? 'bg-red-400 border-red-500' : med.iconColor}`}></div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-black capitalize">{med.name}</h3>
                                        <p className="text-sm font-extralight text-gray-700 capitalize">{med.instruction}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {(med.status === 'pending' || med.status === 'not taken') && (
                                        <button
                                            onClick={() => updateMedStatus(med.unique_id, 'not taken')}
                                            disabled={med.status !== 'pending'}
                                            className={`flex items-center h-8 rounded-[10px] bg-[#F7F9F9] border border-red-500 transition-all overflow-hidden ${
                                                med.status === 'not taken' ? 'w-24 cursor-default' : 'w-8 hover:w-24'
                                            }`}
                                        >
                                            <svg className="w-5 h-5 text-red-600 shrink-0 ml-1.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            <span className="text-red-600 font-semibold text-sm ml-1 whitespace-nowrap">Not Taken</span>
                                        </button>
                                    )}
                                    {(med.status === 'pending' || med.status === 'taken') && (
                                        <button
                                            onClick={() => updateMedStatus(med.unique_id, 'taken')}
                                            disabled={med.status !== 'pending'}
                                            className={`flex items-center h-8 rounded-[10px] bg-[#F7F9F9] border border-[#2081C3] transition-all overflow-hidden ${
                                                med.status === 'taken' ? 'w-24 cursor-default' : 'w-8 hover:w-24'
                                            }`}
                                        >
                                            <svg className="w-5 h-5 text-[#2081C3] shrink-0 ml-1.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-[#2081C3] font-semibold text-sm ml-1 whitespace-nowrap">Taken</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-[#63D2FF]/75 rounded-b-2xl -mx-4 -mb-4 p-4 grid grid-cols-4 text-center gap-2">
                                <div className="col-span-1 flex flex-col"><span className="text-sm font-extralight text-[#2081C3]">Dosage</span><span className="font-semibold text-gray-700">{med.dosage}</span></div>
                                <div className="col-span-3 grid grid-cols-2 gap-2">
                                    <div className="flex flex-col"><span className="text-sm font-extralight text-[#2081C3]">Time</span><span className="font-semibold text-gray-700">{med.time}</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-extralight text-[#2081C3]">Inventory</span><span className="font-semibold text-sm leading-tight text-gray-700">{med.inventory}<br/>remaining</span></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
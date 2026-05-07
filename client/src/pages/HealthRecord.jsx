import { useState, useEffect } from 'react';
import '../css/Home.css';
import '../css/Font.css';

const API_BASE_URL = '/server';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
});

// Reusing the BP Status logic from your Nav to color-code the history list
const getBPStatus = (sys, dia) => {
    if (!sys || !dia) return { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-100' };
    const s = parseInt(sys, 10); const d = parseInt(dia, 10);
    if (s > 180 || d > 120) return { label: 'Crisis', color: 'text-red-700', bg: 'bg-red-100' };
    if (s >= 140 || d >= 90) return { label: 'High (Stage 2)', color: 'text-orange-700', bg: 'bg-orange-100' };
    if (s >= 130 || d >= 80) return { label: 'High (Stage 1)', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    if (s >= 120 && d < 80) return { label: 'Elevated', color: 'text-blue-700', bg: 'bg-blue-100' };
    if (s < 120 && d < 80) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    return { label: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-100' };
};

// ==========================================
// CUSTOM SVG GRAPH COMPONENT
// ==========================================
const CustomGraph = ({ data, view }) => {
    if (!data || data.length === 0) {
        return <div className="h-48 flex items-center justify-center text-gray-400 font-k2d text-sm border-2 border-dashed border-gray-200 rounded-2xl">No recorded history yet</div>;
    }

    const width = 300;
    const height = 120;
    const padding = 20;

    // Sort data chronologically for the graph (oldest to newest)
    const sortedData = [...data].reverse();

    // Determine min and max for scaling
    let minVal, maxVal;
    if (view === 'bp') {
        const allSys = sortedData.map(d => d.systolic);
        const allDia = sortedData.map(d => d.diastolic);
        minVal = Math.min(...allDia) - 10;
        maxVal = Math.max(...allSys) + 10;
    } else {
        const allHr = sortedData.map(d => d.heart_bpm);
        minVal = Math.min(...allHr) - 10;
        maxVal = Math.max(...allHr) + 10;
    }

    // Helper to calculate X and Y coordinates
    const getX = (index) => padding + (index * ((width - padding * 2) / Math.max(sortedData.length - 1, 1)));
    const getY = (val) => height - padding - (((val - minVal) / (maxVal - minVal)) * (height - padding * 2));

    // Generate Path Strings
    const sysPath = sortedData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.systolic)}`).join(' ');
    const diaPath = sortedData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.diastolic)}`).join(' ');
    const hrPath = sortedData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.heart_bpm)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 drop-shadow-sm overflow-visible">
            {/* Background Grid Lines */}
            <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
            <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
            <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />

            {view === 'bp' ? (
                <>
                    {/* Diastolic Line & Dots (Teal) */}
                    <path d={diaPath} fill="none" stroke="#78D5D7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                    {sortedData.map((d, i) => (
                        <circle key={`dia-${i}`} cx={getX(i)} cy={getY(d.diastolic)} r="4" fill="#78D5D7" stroke="#FFF" strokeWidth="2" />
                    ))}

                    {/* Systolic Line & Dots (Primary Blue) */}
                    <path d={sysPath} fill="none" stroke="#2081C3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                    {sortedData.map((d, i) => (
                        <circle key={`sys-${i}`} cx={getX(i)} cy={getY(d.systolic)} r="4" fill="#2081C3" stroke="#FFF" strokeWidth="2" />
                    ))}
                </>
            ) : (
                <>
                    {/* Heart Rate Line & Dots (Pastel Red/Pink) */}
                    <path d={hrPath} fill="none" stroke="#FF8DA1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                    {sortedData.map((d, i) => (
                        <circle key={`hr-${i}`} cx={getX(i)} cy={getY(d.heart_bpm)} r="4" fill="#FF8DA1" stroke="#FFF" strokeWidth="2" />
                    ))}
                </>
            )}
        </svg>
    );
};


// ==========================================
// MAIN HEALTH RECORD COMPONENT
// ==========================================
export default function HealthRecord() {
    const [history, setHistory] = useState([]);
    const [graphView, setGraphView] = useState('bp'); // 'bp' or 'hr'
    const [loading, setLoading] = useState(true);

    const fetchVitalsHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/log/vitals`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({})
            });

            const data = await response.json();
            if (response.ok && data.success && data.vitals_list) {
                const cleanVitals = data.vitals_list.filter(record =>
                    record !== null &&
                    record !== undefined &&
                    record.systolic
                );

                setHistory(cleanVitals);
            }
        } catch (error) {
            console.error("Error fetching vitals:", error);
            setHistory([
                { id: 1, systolic: 122, diastolic: 82, heart_bpm: 74, logged_at: new Date(Date.now() - 86400000 * 0).toISOString() },
                { id: 2, systolic: 126, diastolic: 84, heart_bpm: 76, logged_at: new Date(Date.now() - 86400000 * 1).toISOString() },
                { id: 3, systolic: 118, diastolic: 79, heart_bpm: 71, logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
                { id: 4, systolic: 130, diastolic: 88, heart_bpm: 82, logged_at: new Date(Date.now() - 86400000 * 3).toISOString() },
                { id: 5, systolic: 120, diastolic: 80, heart_bpm: 72, logged_at: new Date(Date.now() - 86400000 * 4).toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVitalsHistory();
    }, []);

    const latestVitals = history.length > 0 ? history[0] : null;
    const latestStatus = latestVitals ? getBPStatus(latestVitals.systolic, latestVitals.diastolic) : null;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F7F9F9] relative pb-28 font-k2d text-gray-900 overflow-x-hidden">

            {/* --- Header Section --- */}
            <div className="bg-[#2081C3] pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm relative">
                <h1 className="text-white text-[2.5rem] font-k2d font-semibold leading-none mb-2">
                    Vitals<br/>History
                </h1>
                <p className="text-white/80 text-sm font-k2d font-extralight">Track your heart health over time.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48 text-[#2081C3] font-semibold animate-pulse">Loading Records...</div>
            ) : (
                <div className="px-5 pt-6 space-y-6">

                    {/* --- Latest Reading Summary Cards --- */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Latest BP Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-[#E8F4FA] flex items-center justify-center text-[#2081C3] text-sm">🩸</div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Latest BP</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-[#2081C3] leading-none">
                                    {latestVitals ? `${latestVitals.systolic}/${latestVitals.diastolic}` : '--'}
                                </span>
                                <span className="text-xs text-gray-400 ml-1">mmHg</span>
                            </div>
                            {latestStatus && (
                                <div className="mt-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${latestStatus.bg} ${latestStatus.color}`}>
                                        {latestStatus.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Latest HR Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-[#FFDFBA]/50 flex items-center justify-center text-red-500 text-sm">❤️</div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Heart Rate</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-800 leading-none">
                                    {latestVitals ? latestVitals.heart_bpm : '--'}
                                </span>
                                <span className="text-xs text-gray-400 ml-1">bpm</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-[10px] font-semibold text-gray-500">Resting Average</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Interactive Graph Section --- */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                        {/* Toggle Switches */}
                        <div className="flex bg-[#F7F9F9] p-1 rounded-xl mb-4 border border-gray-200">
                            <button
                                onClick={() => setGraphView('bp')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${graphView === 'bp' ? 'bg-white text-[#2081C3] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Blood Pressure
                            </button>
                            <button
                                onClick={() => setGraphView('hr')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${graphView === 'hr' ? 'bg-white text-[#FF8DA1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Heart Rate
                            </button>
                        </div>

                        {/* Chart Legend */}
                        {graphView === 'bp' ? (
                            <div className="flex justify-center gap-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#2081C3]"></div> Systolic</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#78D5D7]"></div> Diastolic</span>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FF8DA1]"></div> Beats Per Minute</span>
                            </div>
                        )}

                        {/* Render SVG Graph */}
                        <CustomGraph data={history} view={graphView} />
                    </div>

                    {/* --- History Log List --- */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#2081C3] mb-3 px-1">Recent Logs</h3>
                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No records found.</p>
                            ) : (
                                history.map((record, idx) => {
                                    const recordStatus = getBPStatus(record.systolic, record.diastolic);

                                    // Parse logged_at from the database safely
                                    const dateObj = record.logged_at ? new Date(record.logged_at) : null;
                                    const isValidDate = dateObj && !isNaN(dateObj.getTime());

                                    const displayMonth = isValidDate ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : '---';
                                    const displayDay = isValidDate ? dateObj.getDate() : '-';
                                    const timeStr = isValidDate ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--:--';

                                    return (
                                        <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#63D2FF] transition-colors">
                                            {/* Left: Date & Time */}
                                            <div className="flex flex-col items-center justify-center bg-[#F7F9F9] w-14 h-14 rounded-xl border border-gray-200 shrink-0">
                                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1">{displayMonth}</span>
                                                <span className="text-lg font-bold text-[#2081C3] leading-none">{displayDay}</span>
                                            </div>

                                            {/* Middle: Stats */}
                                            <div className="flex-1 px-4 flex flex-col justify-center">
                                                <div className="flex items-end gap-3 mb-0.5">
                                                    <span className="text-lg font-bold text-gray-800 leading-none">{record.systolic}/{record.diastolic}</span>
                                                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-1 leading-none pb-[2px]">
                                                        <span className="text-red-400 text-xs">❤️</span> {record.heart_bpm}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 font-medium">Logged at {timeStr}</span>
                                            </div>

                                            {/* Right: Status Pill */}
                                            <div className="shrink-0 flex flex-col items-end justify-center">
                                                <div className={`w-3 h-3 rounded-full ${recordStatus.bg.replace('bg-', 'bg-').replace('100', '400')} shadow-sm mb-1`}></div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
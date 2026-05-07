import { useState, useEffect } from 'react';
import '../css/Font.css';
import '../css/Prescription.css';

export default function Prescription() {
    const [view, setView] = useState('current');
    const [currentPrescriptions, setCurrentPrescriptions] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getToken = () => sessionStorage.getItem('authToken');; 

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        fetchPrescriptionData();
    }, []);

    const fetchPrescriptionData = async () => {
        setIsLoading(true);
        try {
            const token = getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            };

            // 1. Fetch Active Prescriptions
            const activeRes = await fetch('/server/prescription/get-active', { 
                method: 'POST', 
                headers 
            });
            const activeData = await activeRes.json();
            
            if (activeData.success && activeData.prescriptions) {
                // For each prescription, fetch its medicines
                const prescriptionsWithMeds = await Promise.all(
                    activeData.prescriptions.map(async (prescription) => {
                        try {
                            const medsRes = await fetch('/server/medicine/get', {
                                method: 'POST',
                                headers
                            });
                            const medsData = await medsRes.json();
                            // Filter medicines by prescription_id
                            const prescriptionMeds = medsData.medicines?.filter(
                                med => med.prescription_id === prescription.id
                            ) || [];
                            return {
                                ...prescription,
                                medicines: prescriptionMeds
                            };
                        } catch (err) {
                            console.error(`Failed to fetch medicines for prescription ${prescription.id}:`, err);
                            return { ...prescription, medicines: [] };
                        }
                    })
                );
                setCurrentPrescriptions(prescriptionsWithMeds);
            }

            // 2. Fetch All Prescriptions (to derive history)
            const allRes = await fetch('/server/prescription/get', { 
                method: 'POST', 
                headers 
            });
            const allData = await allRes.json();
            
            if (allData.success && allData.prescriptions) {
                // Get all medicines for filtering
                const medsRes = await fetch('/server/medicine/get', {
                    method: 'POST',
                    headers
                });
                const medsData = await medsRes.json();
                const allMedicines = medsData.medicines || [];

                // Assuming 'history' means prescriptions not in the active list
                const activeIds = new Set(activeData.prescriptions?.map(p => p.id));
                const historyPrescriptions = allData.prescriptions.filter(p => !activeIds.has(p.id));
                
                // Attach medicines to each history prescription
                const historyWithMeds = historyPrescriptions.map(prescription => ({
                    ...prescription,
                    medicines: allMedicines.filter(med => med.prescription_id === prescription.id) || []
                }));
                
                setHistoryList(historyWithMeds);
            }
        } catch (error) {
            console.error("Failed to fetch prescriptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const movePrescriptionToHistory = async (prescription) => {
        try {
            const token = getToken();
            
            // Call your backend /remove endpoint to archive/delete it
            const res = await fetch('/server/prescription/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prescription_id: prescription.id })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // Update local UI state only after the database confirms success
                setCurrentPrescriptions((prev) =>
                    prev.filter((item) => item.id !== prescription.id)
                );

                setHistoryList((prev) => [
                    {
                        id: prescription.id,
                        date_issued: prescription.date_issued, // Adjust keys to match your DB schema
                        doctor_name: prescription.doctor_name,
                        doc_specialization: prescription.doc_specialization,
                    },
                    ...prev,
                ]);
            } else {
                console.error("Failed to remove prescription:", data.error);
            }
        } catch (error) {
            console.error("API error moving prescription to history:", error);
        }
    };

    // Optional loading state UI
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F7F9F9]">Loading prescriptions...</div>;
    }

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
                        {currentPrescriptions.length === 0 && (
                            <p className="text-center text-gray-500">No active prescriptions.</p>
                        )}
                        {currentPrescriptions.map((prescription, idx) => (
                            <div key={prescription.id || idx} className="bg-[#63D2FF] bg-opacity-80 rounded-3xl border border-cyan-200 overflow-hidden">

                                <div className="bg-[#86DDF8] px-5 pt-5 pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold">Prescription #{prescription.id}</h2>
                                        {/* Assuming all items in currentPrescriptions are active */}
                                        <button
                                            type="button"
                                            onClick={() => movePrescriptionToHistory(prescription)}
                                            className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#4ADE80] active:scale-95 transition-transform shadow-sm"
                                        >
                                            Active
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-[15px]">{prescription.doctor_name || 'Unknown Doctor'}</p>
                                            <p className="text-xs text-gray-700">{prescription.doc_specialization || 'No specialization'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* View Picture Button - Wires up to DB image_url if available */}
                                    <div className="flex justify-center mb-6">
                                        <button 
                                            onClick={() => prescription.image_url ? window.open(prescription.image_url, '_blank') : alert('No image uploaded')}
                                            className="bg-[#2081C3] text-white text-sm font-semibold py-2 px-6 rounded-full flex items-center gap-2 shadow-sm active:scale-95 transition-transform"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {prescription.image_url ? 'View Picture' : 'No Picture'}
                                        </button>
                                    </div>

                                    {/* Medications List */}
                                    <div className="space-y-3 mb-6">
                                        {prescription.medicines?.map((med, index) => (
                                            <div key={index} className="bg-[#78D5D7] bg-opacity-40 rounded-xl border border-gray-400 overflow-hidden">
                                                <div className="text-center font-bold text-[15px] py-1 border-b border-gray-400">
                                                    {med.name}
                                                </div>
                                                <div className="bg-[#F7F9F9] flex justify-between items-center px-3 py-2 text-[10px]">
                                                    <span className="text-gray-500">{med.medicine_type}</span>
                                                    <span className="font-bold text-black text-xs">{med.notes || 'No notes'}</span>
                                                    <span className="text-gray-500">{med.strength}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!prescription.medicines || prescription.medicines.length === 0) && (
                                            <div className="text-center text-sm text-gray-600">No medicines listed.</div>
                                        )}
                                    </div>

                                    <div className="text-center text-[11px] text-gray-700 mt-4">
                                        Issued: {prescription.date_issued }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. HISTORY VIEW */}
                {view === 'history' && (
                    <div className="view-content space-y-4">
                        {historyList.length === 0 && (
                            <p className="text-center text-gray-500">No prescription history.</p>
                        )}
                        {historyList.map((item, index) => (
                            <div key={item.id || index} className="bg-[#63D2FF] bg-opacity-70 rounded-2xl overflow-hidden">
                                <div className="bg-[#86DDF8] px-4 py-2">
                                    <div className="flex justify-between items-center text-[11px] text-gray-600">
                                        <span>ID #{item.id}</span>
                                        <span>{item.date_issued }</span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-end mt-1">
                                        <div>
                                            <p className="font-bold text-[14px] leading-tight text-black">{item.doctor_name || 'Unknown Doctor'}</p>
                                            <p className="text-[10px] text-gray-700">{item.doc_specialization || 'No specialization'}</p>
                                        </div>
                                        <button 
                                            onClick={() => item.image_url ? window.open(item.image_url, '_blank') : alert('No image uploaded')}
                                            className="bg-[#2081C3] text-white text-xs font-semibold py-1.5 px-4 rounded-full shadow-sm active:scale-95 transition-transform"
                                        >
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
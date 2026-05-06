import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/homeIcon.svg';
import healthIcon from '../assets/healthIcon.svg';
import prescriptionIcon from '../assets/prescriptionIcon.svg';
import inventoryIcon from '../assets/inventoryIcon.svg';
import profileIcon from '../assets/profileIcon.svg';

const ActionButton = ({ title, fullWidth, onClick }) => (
    <button
        onClick={onClick}
        className={`bg-[#63D2FF] bg-opacity-80 hover:bg-opacity-100 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors hover:cursor-pointer active:scale-95 duration-200 ${
            fullWidth ? 'col-span-2' : ''
        }`}
    >
        <div className="w-12 h-12 rounded-full bg-[#BED8D4] bg-opacity-70 flex items-center justify-center text-[#2081C3] font-bold text-xl">
            {title === 'Scan Prescription' ? '📷' : title === 'Take Medicine' ? '💊' : '+'}
        </div>
        <span className="text-[#F7F9F9] text-sm font-medium font-k2d text-center leading-tight">
            {title}
        </span>
    </button>
);

// ==========================================
// MAIN NAV COMPONENT
// ==========================================
export default function Nav({ activeTab }) {
    const [fabOpen, setFabOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        setFabOpen(false);
    };

    const handleActionClick = (modalName) => {
        setActiveModal(modalName);
        setFabOpen(false);
    };

    return (
        <>
            {/* --- Blurred Overlay for FAB Menu --- */}
            <div
                className={`fixed inset-0 bg-[#F7F9F9]/20 backdrop-blur-md z-40 transition-opacity duration-500 ease-in-out ${
                    fabOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setFabOpen(false)}
            />

            {/* --- Main Expanding Nav Container --- */}
            <nav className={`fixed bottom-0 w-full max-w-md mx-auto inset-x-0 bg-[#2081C3] rounded-t-[2.5rem] transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl ${
                fabOpen ? 'h-[75vh]' : 'h-24'
            }`}>

                {/* Navigation Icons */}
                <div className={`absolute bottom-0 w-full h-24 px-4 flex justify-around items-center transition-all duration-300 ${
                    fabOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 delay-200 translate-y-0'
                }`}>
                    <button onClick={() => handleNavigation('/home')} className={`p-3 rounded-2xl transition-colors duration-300 hover:cursor-pointer ${activeTab === 'home' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={homeIcon} alt="Home" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/health')} className={`p-3 rounded-2xl transition-colors duration-300 hover:cursor-pointer ${activeTab === 'health' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={healthIcon} alt="Health" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/prescription')} className={`p-3 rounded-2xl transition-colors duration-300 hover:cursor-pointer ${activeTab === 'prescription' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={prescriptionIcon} alt="Prescription" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/inventory')} className={`p-3 rounded-2xl transition-colors duration-300 hover:cursor-pointer ${activeTab === 'inventory' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={inventoryIcon} alt="Inventory" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/profile')} className={`p-3 rounded-2xl transition-colors duration-300 hover:cursor-pointer ${activeTab === 'profile' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={profileIcon} alt="Profile" className="w-8 h-8" />
                    </button>
                </div>

                {/* FAB Menu Content */}
                <div className={`w-full h-full pt-8 px-6 transition-all duration-500 ease-in-out overflow-y-auto pb-24 ${
                    fabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <ActionButton title="Take Medicine" fullWidth onClick={() => handleActionClick('takeMedicine')} />
                        <ActionButton title="Add Medicine" onClick={() => handleActionClick('addMedicine')} />
                        <ActionButton title="Update BP" onClick={() => handleActionClick('updateBP')} />
                        <ActionButton title="Scan Prescription" fullWidth onClick={() => handleActionClick('scanPrescription')} />
                        <ActionButton title="Add Prescription" onClick={() => handleActionClick('addPrescription')} />
                        <ActionButton title="Add Medication" onClick={() => handleActionClick('addMedication')} />
                    </div>
                </div>
            </nav>

            {/* --- Floating Action Button (FAB) --- */}
            <div className="fixed inset-x-0 bottom-0 w-full max-w-md mx-auto pointer-events-none z-[999]">
                <button
                    onClick={() => setFabOpen(!fabOpen)}
                    className={`absolute right-6 w-16 h-16 bg-[#78D5D7] rounded-full flex items-center justify-center shadow-lg text-[#F7F9F9] text-4xl pb-2 font-k2d font-semibold transition-all duration-500 ease-in-out pointer-events-auto border border-[#BED8D4] hover:cursor-pointer ${
                        fabOpen ? 'bottom-8 rotate-[135deg] bg-opacity-90' : 'bottom-[5.5rem] rotate-0'
                    }`}
                >
                    +
                </button>
            </div>

            {/* --- MODAL (BOTTOM SHEET) CONTAINER --- */}
            <div
                className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setActiveModal(null)}
            />

            <div className={`fixed bottom-0 inset-x-0 w-full max-w-md mx-auto ${activeModal === 'scanPrescription' ? 'bg-black h-[90vh]' : 'bg-white h-[85vh]'} rounded-t-3xl z-[1001] transition-transform duration-500 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${
                activeModal ? 'translate-y-0' : 'translate-y-full'
            }`}>

                {/* Drag Handle & NEW FAB-STYLE CLOSE BUTTON */}
                <div className={`w-full flex justify-center pt-5 pb-5 rounded-t-3xl relative ${activeModal === 'scanPrescription' ? 'bg-black text-white' : 'bg-[#2081C3] text-white'}`}>
                    <div className="w-12 h-1.5 bg-white/50 rounded-full absolute top-3"></div>

                    {/* Upgraded Close Button */}
                    <button
                        onClick={() => setActiveModal(null)}
                        className="absolute right-4 top-3 w-10 h-10 bg-[#78D5D7] border-2 border-[#BED8D4] rounded-full flex items-center justify-center shadow-lg text-[#F7F9F9] hover:scale-105 active:scale-95 transition-all z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Sub-components rendered dynamically based on activeModal */}
                <div className={`flex-1 overflow-y-auto font-k2d ${activeModal === 'scanPrescription' ? 'bg-black' : 'bg-[#F7F9F9]'}`}>
                    {activeModal === 'takeMedicine' && <TakeMedicineView closeModal={() => setActiveModal(null)} />}
                    {activeModal === 'addMedicine' && <AddMedicineView closeModal={() => setActiveModal(null)} />}
                    {activeModal === 'addMedication' && <AddMedicationView closeModal={() => setActiveModal(null)} />}
                    {activeModal === 'addPrescription' && <AddPrescriptionView closeModal={() => setActiveModal(null)} />}
                    {activeModal === 'updateBP' && <UpdateBPView closeModal={() => setActiveModal(null)} />}
                    {activeModal === 'scanPrescription' && <ScanPrescriptionView closeModal={() => setActiveModal(null)} />}
                </div>
            </div>
        </>
    );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function TakeMedicineView({ closeModal }) {
    const [selectedMed, setSelectedMed] = useState('');
    const inventory = [
        { id: 1, name: 'Biogesic', stock: 10, dosage: '40mg' },
        { id: 2, name: 'Amoxicillin', stock: 15, dosage: '250mg' },
    ];

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Take Medicine</h2>
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-500 font-semibold pl-1">Select from Schedule/Inventory</label>
                <div className="relative">
                    <select value={selectedMed} onChange={(e) => setSelectedMed(e.target.value)} className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm appearance-none">
                        <option value="" disabled>Choose medication...</option>
                        {inventory.map(med => (
                            <option key={med.id} value={med.name}>{med.name} ({med.dosage}) - {med.stock} left</option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedMed && (
                <div className="bg-[#E8F4FA] border border-[#2081C3]/30 p-4 rounded-xl flex items-center gap-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-[#2081C3] text-white flex items-center justify-center shrink-0">⏰</div>
                    <div>
                        <p className="text-sm text-gray-600">Time recorded as:</p>
                        <p className="font-semibold text-[#2081C3]">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                </div>
            )}
            <div className="mt-auto pt-6">
                <button onClick={closeModal} disabled={!selectedMed} className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${selectedMed ? 'bg-[#2081C3] text-white active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Log Intake
                </button>
            </div>
        </div>
    );
}

function AddMedicineView({ closeModal }) {
    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Add to Inventory</h2>

            <div className="space-y-4 overflow-y-auto">
                {/* Medicine Name (Text Input + Datalist for existing meds) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Medicine Name</label>
                    <input
                        type="text"
                        placeholder="Type new or select existing..."
                        list="existing-meds"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm"
                    />
                    <datalist id="existing-meds">
                        <option value="Biogesic" />
                        <option value="Amoxicillin" />
                        <option value="Meth" />
                    </datalist>
                </div>

                {/* Dosage & Type Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Dosage</label>
                        <input
                            type="text"
                            placeholder="e.g. 500mg"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Type</label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm appearance-none">
                                <option>Tablet / Pill</option>
                                <option>Capsule</option>
                                <option>Powder</option>
                                <option>Liquid / Syrup</option>
                                <option>Inhaler</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quantity Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Quantity Added</label>
                    <input
                        type="number"
                        placeholder="e.g. 20"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm"
                    />
                </div>
            </div>

            <div className="mt-8 pt-2">
                <button onClick={closeModal} className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 transition-all text-lg font-semibold">
                    Add to Inventory
                </button>
            </div>
        </div>
    );
}

function AddMedicationView({ closeModal }) {
    const [selectedColor, setSelectedColor] = useState('bg-[#FFB3BA]');
    const [selectedDays, setSelectedDays] = useState(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);

    // NEW: State to manage an array of specific times
    const [times, setTimes] = useState(['08:00']);

    const pastelColors = ['bg-[#FFB3BA]', 'bg-[#FFDFBA]', 'bg-[#FFFFBA]', 'bg-[#BAFFC9]', 'bg-[#BAE1FF]', 'bg-[#E8B2FF]'];
    const daysOfWeek = [
        { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
        { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
    ];

    const toggleDay = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    // --- Dynamic Time Handlers ---
    const handleAddTime = () => {
        setTimes([...times, '12:00']); // Defaults the new field to 12:00 PM
    };

    const handleRemoveTime = (indexToRemove) => {
        setTimes(times.filter((_, index) => index !== indexToRemove));
    };

    const handleTimeChange = (index, newValue) => {
        const updatedTimes = [...times];
        updatedTimes[index] = newValue;
        setTimes(updatedTimes);
    };

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Create Medication Schedule</h2>

            <div className="space-y-4 overflow-y-auto pr-1 pb-4">
                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Name</label>
                    <input type="text" placeholder="e.g. Vitamin C" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                </div>

                {/* Dosage & Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Dosage</label>
                        <input type="text" placeholder="e.g. 500mg" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Type</label>
                        <div className="relative">
                            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700">
                                <option>Tablet</option>
                                <option>Capsule</option>
                                <option>Liquid</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">Start Date</label>
                        <input type="date" className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">End Date</label>
                        <input type="date" className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm text-sm" />
                    </div>
                </div>

                {/* Days of the Week Selector */}
                <div className="flex flex-col gap-2 pt-1">
                    <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">Days to Take</label>
                    <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                        {daysOfWeek.map(day => (
                            <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                className={`w-9 h-9 rounded-full font-semibold text-sm transition-all ${
                                    selectedDays.includes(day.id)
                                        ? 'bg-[#2081C3] text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* NEW: Dynamic Times Array */}
                <div className="flex flex-col gap-2 pt-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Times to Take</label>
                        <button onClick={handleAddTime} className="text-[#2081C3] text-xs font-bold hover:underline">
                            + Add Time
                        </button>
                    </div>
                    <div className="space-y-2">
                        {times.map((time, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => handleTimeChange(index, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700"
                                />
                                {/* Only show the remove button if there is more than 1 time input */}
                                {times.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveTime(index)}
                                        className="w-12 h-[50px] flex items-center justify-center text-red-500 border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 transition-colors shrink-0 shadow-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assign Color */}
                <div className="flex flex-col gap-3 pt-2 pb-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Assign Color</label>
                    <div className="flex justify-between px-1">
                        {pastelColors.map((color, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${selectedColor === color ? 'border-[#2081C3] scale-110 shadow-sm' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-2">
                <button
                    onClick={() => {
                        console.log("Saving schedule with times: ", times);
                        closeModal();
                    }}
                    className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 text-lg font-semibold transition-transform"
                >
                    Save Schedule
                </button>
            </div>
        </div>
    );
}

function UpdateBPView({ closeModal }) {
    const [vitals, setVitals] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        date: new Date().toISOString().split('T')[0], // Defaults to today YYYY-MM-DD
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) // Defaults to current time
    });

    const getBPStatus = (sys, dia) => {
        if (!sys || !dia) return { label: 'Enter vitals', color: 'text-gray-400', bg: 'bg-gray-100' };

        const s = parseInt(sys);
        const d = parseInt(dia);

        if (s > 180 || d > 120) return { label: 'Crisis - Seek Care', color: 'text-red-700', bg: 'bg-red-100' };
        if (s >= 140 || d >= 90) return { label: 'High (Stage 2)', color: 'text-orange-700', bg: 'bg-orange-100' };
        if (s >= 130 || d >= 80) return { label: 'High (Stage 1)', color: 'text-yellow-700', bg: 'bg-yellow-100' };
        if (s >= 120 && d < 80) return { label: 'Elevated', color: 'text-blue-700', bg: 'bg-blue-100' };
        if (s < 120 && d < 80) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };

        return { label: 'Checking...', color: 'text-gray-500', bg: 'bg-gray-100' };
    };

    const status = getBPStatus(vitals.systolic, vitals.diastolic);

    // Only allow saving if all three vital numbers are filled out
    const isReadyToSave = vitals.systolic && vitals.diastolic && vitals.heartRate;

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Log Blood Pressure</h2>

            <div className="space-y-6 overflow-y-auto pr-1">

                {/* BP Inputs Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Systolic (mmHg)</label>
                        <input
                            type="number"
                            placeholder="120"
                            value={vitals.systolic}
                            onChange={(e) => setVitals({...vitals, systolic: e.target.value})}
                            className="w-full px-4 py-6 text-center text-3xl font-bold bg-white border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Diastolic (mmHg)</label>
                        <input
                            type="number"
                            placeholder="80"
                            value={vitals.diastolic}
                            onChange={(e) => setVitals({...vitals, diastolic: e.target.value})}
                            className="w-full px-4 py-6 text-center text-3xl font-bold bg-white border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Dynamic Status Indicator */}
                <div className="flex justify-center -mt-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.color} transition-colors duration-300`}>
                        {status.label}
                    </span>
                </div>

                {/* Heart Rate Input */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Heart Rate (BPM)</label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="72"
                            value={vitals.heartRate}
                            onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm text-lg"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <span className="text-red-500 animate-pulse text-xl">❤️</span>
                        </div>
                    </div>
                </div>

                {/* Date and Time Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Date</label>
                        <input
                            type="date"
                            value={vitals.date}
                            onChange={(e) => setVitals({...vitals, date: e.target.value})}
                            className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700 shadow-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Time</label>
                        <input
                            type="time"
                            value={vitals.time}
                            onChange={(e) => setVitals({...vitals, time: e.target.value})}
                            className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700 shadow-sm"
                        />
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-2">
                <button
                    onClick={() => {
                        console.log("Saving Vitals: ", vitals, "Status: ", status.label);
                        closeModal();
                    }}
                    disabled={!isReadyToSave}
                    className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${isReadyToSave ? 'bg-[#2081C3] text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    Save Vitals
                </button>
            </div>
        </div>
    );
}

function AddPrescriptionView({ closeModal }) {
    const [step, setStep] = useState(1);
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);

    const [tempMed, setTempMed] = useState({
        name: '', dosage: '', type: 'Tablet', totalAmount: '',
        startTime: '08:00', hourlyGap: '', maxPerDay: '',
        startDate: '', endDate: '',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        takenAtMeals: false // NEW: Track if taken at meals
    });

    const daysOfWeek = [
        { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
        { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
    ];

    const toggleTempMedDay = (dayId) => {
        setTempMed(prev => ({
            ...prev,
            days: prev.days.includes(dayId)
                ? prev.days.filter(d => d !== dayId)
                : [...prev.days, dayId]
        }));
    };

    const calculateSchedule = (start, gap, max, atMeals) => {
        if (atMeals) {
            const m = parseInt(max, 10) || 0;
            if (m === 0) return ["With Meals"];
            if (m === 1) return ["With 1 Meal"];
            return [`With ${m} Meals`];
        }

        if (!start) return [];
        const times = [start];
        const g = parseInt(gap, 10);
        let m = parseInt(max, 10);

        if (g > 0) {
            if (isNaN(m) || m <= 0) {
                m = Math.floor(24 / g);
            }

            if (m > 1) {
                let [hours, minutes] = start.split(':').map(Number);
                for (let i = 1; i < m; i++) {
                    const nextHour = (hours + (i * g)) % 24;
                    times.push(`${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                }
            }
        }
        return times;
    };

    // UPDATED: Formatter that respects text strings like "With 3 Meals"
    const formatTimeAMPM = (timeStr) => {
        if (!timeStr) return '';
        if (timeStr.startsWith('With')) return timeStr; // Return meal strings as-is

        const [h, m] = timeStr.split(':');
        if (!m) return timeStr; // Fallback

        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${m} ${ampm}`;
    };

    const handleAddMedicineToList = () => {
        if (tempMed.name.trim() !== '') {
            const calculatedTimes = calculateSchedule(tempMed.startTime, tempMed.hourlyGap, tempMed.maxPerDay, tempMed.takenAtMeals);
            setPrescriptionMeds([...prescriptionMeds, { ...tempMed, calculatedTimes }]);
            // Reset the mini-form
            setTempMed({
                name: '', dosage: '', type: 'Tablet', totalAmount: '',
                startTime: '08:00', hourlyGap: '', maxPerDay: '',
                startDate: '', endDate: '', days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
                takenAtMeals: false
            });
        }
    };

    const handleRemoveMedicine = (indexToRemove) => {
        setPrescriptionMeds(prescriptionMeds.filter((_, index) => index !== indexToRemove));
    };

    // Generate preview using the new logic
    const previewTimes = calculateSchedule(tempMed.startTime, tempMed.hourlyGap, tempMed.maxPerDay, tempMed.takenAtMeals);

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <div className="flex items-center gap-3 mb-6">
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 text-[#2081C3]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                )}
                <h2 className="text-2xl font-semibold text-[#2081C3]">
                    {step === 1 ? 'Manual Prescription' : 'Add Medicines'}
                </h2>
            </div>

            {step === 1 && (
                <>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-500 font-semibold pl-1">Doctor Name</label>
                            <input type="text" placeholder="Dr. John Doe" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-500 font-semibold pl-1">Specialization</label>
                            <input type="text" placeholder="Cardiology" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3]" />
                        </div>
                    </div>

                    <div className="mt-8 pt-2">
                        <button onClick={() => setStep(2)} className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 transition-all text-lg font-semibold">
                            Proceed to Add Medicines
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="flex-1 overflow-y-auto pr-1 space-y-6">

                        {/* List of Added Medicines */}
                        {prescriptionMeds.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 font-semibold pl-1">Medicines in this Prescription:</p>
                                {prescriptionMeds.map((med, idx) => (
                                    <div key={idx} className="bg-[#E8F4FA] border border-[#2081C3]/30 p-3 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{med.name}</p>
                                            <p className="text-xs text-gray-600">{med.dosage} • {med.type} • Total: {med.totalAmount}</p>

                                            <p className="text-xs font-semibold text-[#2081C3] mt-1">
                                                {med.calculatedTimes.map(formatTimeAMPM).join(med.takenAtMeals ? '' : ', ')}
                                            </p>

                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                {med.days.length === 7 ? 'Everyday' : med.days.map(d => d.charAt(0).toUpperCase() + d.slice(1,3)).join(', ')}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveMedicine(idx)}
                                            className="w-10 h-10 bg-white border border-red-100 rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-50 active:scale-95 transition-all shrink-0 ml-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <hr className="border-gray-200 my-4"/>
                            </div>
                        )}

                        {/* Form to add a medicine */}
                        <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-[#2081C3] font-semibold">Add New Medicine</h3>

                            <div className="flex flex-col gap-3">
                                <input
                                    type="text" placeholder="Medicine Name" value={tempMed.name}
                                    onChange={(e) => setTempMed({...tempMed, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2081C3]"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text" placeholder="Dosage (e.g. 500mg)" value={tempMed.dosage}
                                        onChange={(e) => setTempMed({...tempMed, dosage: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2081C3]"
                                    />
                                    <div className="relative">
                                        <select
                                            value={tempMed.type} onChange={(e) => setTempMed({...tempMed, type: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-[#2081C3] text-gray-700"
                                        >
                                            <option>Tablet</option><option>Capsule</option><option>Powder</option><option>Liquid</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mt-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Total Prescribed Amount</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 30 pieces"
                                        value={tempMed.totalAmount}
                                        onChange={(e) => setTempMed({...tempMed, totalAmount: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Start Date</label>
                                        <input type="date" value={tempMed.startDate} onChange={(e) => setTempMed({...tempMed, startDate: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">End Date</label>
                                        <input type="date" value={tempMed.endDate} onChange={(e) => setTempMed({...tempMed, endDate: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 pt-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Days to Take</label>
                                    <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                                        {daysOfWeek.map(day => (
                                            <button
                                                key={day.id}
                                                onClick={() => toggleTempMedDay(day.id)}
                                                className={`w-8 h-8 rounded-full font-semibold text-[11px] transition-all ${
                                                    tempMed.days.includes(day.id)
                                                        ? 'bg-[#2081C3] text-white shadow-md'
                                                        : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2 ml-1">
                                    <input
                                        type="checkbox"
                                        id="takenAtMeals"
                                        checked={tempMed.takenAtMeals}
                                        onChange={(e) => setTempMed({...tempMed, takenAtMeals: e.target.checked, startTime: e.target.checked ? '' : '08:00', hourlyGap: e.target.checked ? '' : tempMed.hourlyGap})}
                                        className="w-4 h-4 text-[#2081C3] bg-gray-50 border-gray-300 rounded focus:ring-[#2081C3] cursor-pointer"
                                    />
                                    <label htmlFor="takenAtMeals" className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
                                        Taken at meals
                                    </label>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    <div className="flex flex-col gap-1">
                                        <label className={`text-[10px] font-semibold uppercase tracking-wider pl-1 ${tempMed.takenAtMeals ? 'text-gray-300' : 'text-gray-500'}`}>First Dose</label>
                                        <input
                                            type="time"
                                            value={tempMed.startTime}
                                            onChange={(e) => setTempMed({...tempMed, startTime: e.target.value})}
                                            disabled={tempMed.takenAtMeals}
                                            className={`w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#2081C3] ${tempMed.takenAtMeals ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className={`text-[10px] font-semibold uppercase tracking-wider pl-1 ${tempMed.takenAtMeals ? 'text-gray-300' : 'text-gray-500'}`}>Gap (hrs)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 8"
                                            value={tempMed.hourlyGap}
                                            onChange={(e) => setTempMed({...tempMed, hourlyGap: e.target.value})}
                                            disabled={tempMed.takenAtMeals}
                                            className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] ${tempMed.takenAtMeals ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Max / Day</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 3"
                                            value={tempMed.maxPerDay}
                                            onChange={(e) => setTempMed({...tempMed, maxPerDay: e.target.value})}
                                            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3]"
                                        />
                                    </div>
                                </div>

                                <div className="bg-[#F7F9F9] rounded-lg p-2 text-center border border-gray-100 mt-1">
                                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Generated Schedule</p>
                                    <p className="text-[#2081C3] font-bold text-sm mt-1">
                                        {previewTimes.length > 0 ? previewTimes.map(formatTimeAMPM).join(tempMed.takenAtMeals ? '' : ' → ') : '--:--'}
                                    </p>
                                </div>
                            </div>

                            <button onClick={handleAddMedicineToList} disabled={!tempMed.name} className={`w-full py-3 mt-4 rounded-xl font-semibold transition-all ${tempMed.name ? 'bg-[#63D2FF] text-white active:scale-95 shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                + Add to List
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 bg-white">
                        <button onClick={() => { console.log("Saving: ", prescriptionMeds); closeModal(); }} disabled={prescriptionMeds.length === 0} className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${prescriptionMeds.length > 0 ? 'bg-[#2081C3] text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}>
                            Save Complete Prescription
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function ScanPrescriptionView({ closeModal }) {
    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 flex items-center justify-center pt-8">
                {/* Scanner Target Box */}
                <div className="w-4/5 h-3/5 border-2 border-dashed border-[#63D2FF] rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#78D5D7] rounded-tl-xl"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#78D5D7] rounded-tr-xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#78D5D7] rounded-bl-xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#78D5D7] rounded-br-xl"></div>
                </div>
                <p className="absolute bottom-1/4 text-white/80 text-sm font-light text-center w-full px-8">
                    Align the prescription within the frame.<br/>AI will extract the schedule automatically.
                </p>
            </div>
            {/* Shutter Button area */}
            <div className="h-32 flex items-center justify-center pb-8 z-10">
                <button onClick={closeModal} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
            </div>
        </div>
    );
}
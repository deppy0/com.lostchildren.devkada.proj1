import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/homeIcon.svg';
import healthIcon from '../assets/healthIcon.svg';
import prescriptionIcon from '../assets/prescriptionIcon.svg';
import inventoryIcon from '../assets/inventoryIcon.svg';
import profileIcon from '../assets/profileIcon.svg';

const API_BASE_URL = '/server';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
});

const dayMap = {
    'sun': 'Sunday', 'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
    'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
};

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
            <div
                className={`fixed inset-0 bg-[#F7F9F9]/20 backdrop-blur-md z-40 transition-opacity duration-500 ease-in-out ${
                    fabOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setFabOpen(false)}
            />

            <nav className={`fixed bottom-0 w-full max-w-md mx-auto inset-x-0 bg-[#2081C3] rounded-t-[2.5rem] transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl ${
                fabOpen ? 'h-[75vh]' : 'h-24'
            }`}>
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

            <div
                className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setActiveModal(null)}
            />

            <div className={`fixed bottom-0 inset-x-0 w-full max-w-md mx-auto ${activeModal === 'scanPrescription' ? 'bg-black h-[90vh]' : 'bg-white h-[85vh]'} rounded-t-3xl z-[1001] transition-transform duration-500 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${
                activeModal ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className={`w-full flex justify-center pt-5 pb-5 rounded-t-3xl relative ${activeModal === 'scanPrescription' ? 'bg-black text-white' : 'bg-[#2081C3] text-white'}`}>
                    <div className="w-12 h-1.5 bg-white/50 rounded-full absolute top-3"></div>
                    <button
                        onClick={() => setActiveModal(null)}
                        className="absolute right-4 top-3 w-10 h-10 bg-[#78D5D7] border-2 border-[#BED8D4] rounded-full flex items-center justify-center shadow-lg text-[#F7F9F9] hover:scale-105 active:scale-95 transition-all z-10 hover:cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

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
    const [selectedMedId, setSelectedMedId] = useState('');
    const [intakeAmount, setIntakeAmount] = useState('1');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/medicine/get`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({})
        })
            .then(async res => {
                // Check if the response is actually OK and has content
                if (!res.ok) {
                    const text = await res.text(); // Get raw text instead of forcing JSON
                    throw new Error(`Server Error (${res.status}): ${text}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    setInventory(data.medicines || []);
                }
            })
            .catch(err => console.error("Error fetching inventory:", err));
    }, []);

    const handleLogIntake = async () => {
        setLoading(true);
        try {
            const response = await fetch('/server/medicine/subtract-stocks', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    medicine_id: selectedMedId,
                    subtract_amount: parseInt(intakeAmount, 10) || 1
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Failed to log intake");

            closeModal();
            setTimeout(() => { window.location.reload(); }, 300);
        } catch (error) {
            console.error("Error logging intake:", error);
            alert(`Could not log intake: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Take Medicine</h2>

            <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Select from Full Inventory</label>
                    <div className="relative">
                        <select value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)} className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm appearance-none hover:cursor-pointer">
                            <option value="" disabled>Choose medication...</option>
                            {inventory.length > 0 ? inventory.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} (Current Stock: {item.stock_remaining})
                                </option>
                            )) : (
                                <option value="" disabled>No medicines in inventory</option>
                            )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {selectedMedId && (
                    <>
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-sm text-gray-500 font-semibold pl-1">Amount to consume (ml, pieces, etc.)</label>
                            <input
                                type="number"
                                min="1"
                                value={intakeAmount}
                                onChange={(e) => setIntakeAmount(e.target.value)}
                                placeholder="e.g. 1 or 5"
                                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm"
                            />
                        </div>

                        <div className="bg-[#E8F4FA] border border-[#2081C3]/30 p-4 rounded-xl flex items-center gap-4 mt-2">
                            <div className="w-10 h-10 rounded-full bg-[#2081C3] text-white flex items-center justify-center shrink-0">⏰</div>
                            <div>
                                <p className="text-sm text-gray-600">Time recorded as:</p>
                                <p className="font-semibold text-[#2081C3]">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-auto pt-6">
                <button
                    onClick={handleLogIntake}
                    disabled={!selectedMedId || !intakeAmount || loading}
                    className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${selectedMedId && intakeAmount ? 'bg-[#2081C3] text-white active:scale-95 hover:cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    {loading ? 'Logging...' : `Consume ${intakeAmount || 0} Amount`}
                </button>
            </div>
        </div>
    );
}

function AddMedicineView({ closeModal }) {
    const [inventory, setInventory] = useState([]);
    const [selectedMedId, setSelectedMedId] = useState('');
    const [addAmount, setAddAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/server/medicine/get', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({})
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.medicines) setInventory(data.medicines);
            })
            .catch(err => console.error("Error fetching inventory:", err));
    }, []);

    // FIX 1: Removed parseInt because IDs are UUID strings
    const selectedMed = inventory.find(m => m.id === selectedMedId) || {};

    const handleAddStocks = async () => {
        setLoading(true);
        try {
            const response = await fetch('/server/medicine/add-stocks', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    medicine_id: selectedMedId, // FIX 2: Send raw string UUID, no parseInt
                    add_amount: parseInt(addAmount, 10) || 0
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Failed to add stock to inventory");

            closeModal();
            setTimeout(() => { window.location.reload(); }, 300);
        } catch (error) {
            console.error("Backend error details:", error);
            alert(`Could not add stocks: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Restock Inventory</h2>
            <div className="space-y-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Select Medicine</label>
                    <div className="relative">
                        <select value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm appearance-none hover:cursor-pointer">
                            <option value="" disabled>Choose medication to restock...</option>
                            {inventory.map(med => (
                                // FIX 3: Use med.stock_remaining instead of med.stock
                                <option key={med.id} value={med.id}>{med.name} (Current Stock: {med.stock_remaining})</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Dosage</label>
                        {/* FIX 4: Use selectedMed.strength */}
                        <input type="text" value={selectedMed.strength || ''} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 focus:outline-none shadow-sm cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Type</label>
                        {/* FIX 5: Use selectedMed.medicine_type */}
                        <input type="text" value={selectedMed.medicine_type || ''} readOnly placeholder="Auto-filled" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 focus:outline-none shadow-sm cursor-not-allowed" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Quantity to Add</label>
                    <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="e.g. 20" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm" />
                </div>
            </div>

            <div className="mt-8 pt-2">
                <button onClick={handleAddStocks} disabled={loading || !selectedMedId || !addAmount} className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 transition-all text-lg font-semibold hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {loading ? 'Adding...' : 'Add Stocks'}
                </button>
            </div>
        </div>
    );
}

function AddMedicationView({ closeModal }) {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [type, setType] = useState('Tablet');
    const [quantity, setQuantity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedColor, setSelectedColor] = useState('bg-[#FFB3BA]');
    const [selectedDays, setSelectedDays] = useState(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
    const [times, setTimes] = useState(['08:00']);
    const [loading, setLoading] = useState(false);

    const pastelColors = ['bg-[#FFB3BA]', 'bg-[#FFDFBA]', 'bg-[#FFFFBA]', 'bg-[#BAFFC9]', 'bg-[#BAE1FF]', 'bg-[#E8B2FF]'];
    const daysOfWeek = [
        { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
        { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
    ];

    const toggleDay = (dayId) => {
        if (selectedDays.includes(dayId)) setSelectedDays(selectedDays.filter(d => d !== dayId));
        else setSelectedDays([...selectedDays, dayId]);
    };

    const handleAddTime = () => setTimes([...times, '12:00']);
    const handleRemoveTime = (indexToRemove) => setTimes(times.filter((_, index) => index !== indexToRemove));
    const handleTimeChange = (index, newValue) => {
        const updatedTimes = [...times];
        updatedTimes[index] = newValue;
        setTimes(updatedTimes);
    };

    const handleSaveSchedule = async () => {
        setLoading(true);
        try {
            // FORMAT FIX 1: Map short days to Full Capitalized Days for Database match
            const formattedDays = selectedDays.map(d => dayMap[d.toLowerCase()] || d);

            // FORMAT FIX 2: Ensure time has seconds appended for strict DBs ("12:00" -> "12:00:00")
            const formattedTimes = times.map(t => t.length === 5 ? `${t}:00` : t);

            const response = await fetch('/server/medicine/add', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    medicine_json: {
                        name: name,
                        strength: dosage,
                        medicine_type: type,
                        stock_remaining: parseInt(quantity, 10) || 0,
                        start_date: startDate,
                        end_date: endDate,
                        days_taken: selectedDays,
                        start_time_per_day: times,
                        color: selectedColor
                    }
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Backend failed to save schedule.");

            closeModal();
            // FORMAT FIX 3: Add slight delay to give the database time to generate schedule rows before refresh
            setTimeout(() => { window.location.reload(); }, 500);
        } catch (error) {
            console.error("Backend error details:", error);
            alert(`Could not save schedule: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Create Medication Schedule</h2>
            <div className="space-y-4 overflow-y-auto pr-1 pb-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Name</label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Vitamin C" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Dosage</label>
                        <input type="text" value={dosage} onChange={e=>setDosage(e.target.value)} placeholder="e.g. 500mg" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Type</label>
                        <div className="relative">
                            <select value={type} onChange={e=>setType(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700 hover:cursor-pointer">
                                <option>Tablet</option><option>Capsule</option><option>Liquid</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Initial Quantity (Stock)</label>
                    <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="e.g. 30" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">Start Date</label>
                        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm text-sm hover:cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">End Date</label>
                        <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full px-3 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-[#2081C3] shadow-sm text-sm hover:cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                    <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider pl-1">Days to Take</label>
                    <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                        {daysOfWeek.map(day => (
                            <button key={day.id} onClick={() => toggleDay(day.id)} className={`w-9 h-9 rounded-full font-semibold text-sm transition-all hover:cursor-pointer ${selectedDays.includes(day.id) ? 'bg-[#2081C3] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                {day.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Times to Take</label>
                        <button onClick={handleAddTime} className="text-[#2081C3] text-xs font-bold hover:underline hover:cursor-pointer">+ Add Time</button>
                    </div>
                    <div className="space-y-2">
                        {times.map((time, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700 hover:cursor-pointer" />
                                {times.length > 1 && (
                                    <button onClick={() => handleRemoveTime(index)} className="w-12 h-[50px] flex items-center justify-center text-red-500 border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 transition-colors shrink-0 shadow-sm hover:cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3 pt-2 pb-2">
                    <label className="text-sm text-gray-500 font-semibold pl-1">Assign Color</label>
                    <div className="flex justify-between px-1">
                        {pastelColors.map((color, idx) => (
                            <button key={idx} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full hover:cursor-pointer ${color} border-2 transition-all ${selectedColor === color ? 'border-[#2081C3] scale-110 shadow-sm' : 'border-transparent'}`} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-2">
                <button onClick={handleSaveSchedule} disabled={!name || loading} className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 text-lg font-semibold transition-transform disabled:bg-gray-300 disabled:cursor-not-allowed hover:cursor-pointer">
                    {loading ? 'Saving...' : 'Save Schedule'}
                </button>
            </div>
        </div>
    );
}

function UpdateBPView({ closeModal }) {
    const [vitals, setVitals] = useState({
        systolic: '', diastolic: '', heartRate: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });
    const [loading, setLoading] = useState(false);

    const getBPStatus = (sys, dia) => {
        if (!sys || !dia) return { label: 'Enter vitals', color: 'text-gray-400', bg: 'bg-gray-100' };
        const s = parseInt(sys, 10); const d = parseInt(dia, 10);
        if (s > 180 || d > 120) return { label: 'Crisis - Seek Care', color: 'text-red-700', bg: 'bg-red-100' };
        if (s >= 140 || d >= 90) return { label: 'High (Stage 2)', color: 'text-orange-700', bg: 'bg-orange-100' };
        if (s >= 130 || d >= 80) return { label: 'High (Stage 1)', color: 'text-yellow-700', bg: 'bg-yellow-100' };
        if (s >= 120 && d < 80) return { label: 'Elevated', color: 'text-blue-700', bg: 'bg-blue-100' };
        if (s < 120 && d < 80) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
        return { label: 'Checking...', color: 'text-gray-500', bg: 'bg-gray-100' };
    };

    const status = getBPStatus(vitals.systolic, vitals.diastolic);
    const isReadyToSave = vitals.systolic && vitals.diastolic && vitals.heartRate && !loading;

    const handleSaveVitals = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/vitals/record`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    systolic: parseInt(vitals.systolic, 10),
                    diastolic: parseInt(vitals.diastolic, 10),
                    heart_bpm: parseInt(vitals.heartRate, 10)
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Database failed to save");
            closeModal();
            setTimeout(() => { window.location.reload(); }, 300);
        } catch (error) {
            console.error("Backend error details:", error);
            alert(`Could not save vitals: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <h2 className="text-2xl font-semibold text-[#2081C3] mb-6">Log Blood Pressure</h2>
            <div className="space-y-6 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Systolic (mmHg)</label>
                        <input type="number" placeholder="120" value={vitals.systolic} onChange={(e) => setVitals({...vitals, systolic: e.target.value})} className="w-full px-4 py-6 text-center text-3xl font-bold bg-white border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 shadow-sm transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Diastolic (mmHg)</label>
                        <input type="number" placeholder="80" value={vitals.diastolic} onChange={(e) => setVitals({...vitals, diastolic: e.target.value})} className="w-full px-4 py-6 text-center text-3xl font-bold bg-white border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-[#2081C3] focus:ring-1 focus:ring-[#2081C3] shadow-sm transition-all" />
                    </div>
                </div>
                <div className="flex justify-center -mt-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.color} transition-colors duration-300`}>{status.label}</span>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Heart Rate (BPM)</label>
                    <div className="relative">
                        <input type="number" placeholder="72" value={vitals.heartRate} onChange={(e) => setVitals({...vitals, heartRate: e.target.value})} className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm text-lg" />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none"><span className="text-red-500 animate-pulse text-xl">❤️</span></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Date</label>
                        <input type="date" value={vitals.date} onChange={(e) => setVitals({...vitals, date: e.target.value})} className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700 shadow-sm hover:cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Time</label>
                        <input type="time" value={vitals.time} onChange={(e) => setVitals({...vitals, time: e.target.value})} className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] text-gray-700 shadow-sm hover:cursor-pointer" />
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-2">
                <button onClick={handleSaveVitals} disabled={!isReadyToSave} className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${isReadyToSave ? 'bg-[#2081C3] text-white active:scale-95 hover:cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    {loading ? 'Saving...' : 'Save Vitals'}
                </button>
            </div>
        </div>
    );
}

function AddPrescriptionView({ closeModal }) {
    const [step, setStep] = useState(1);
    const [docName, setDocName] = useState('');
    const [docSpec, setDocSpec] = useState('');
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userMealTimes, setUserMealTimes] = useState({
        breakfast: '07:00',
        lunch: '12:00',
        dinner: '18:00'
    });

    const [tempMed, setTempMed] = useState({
        name: '', dosage: '', type: 'Tablet', totalAmount: '', startTime: '08:00', hourlyGap: '', maxPerDay: '',
        startDate: '', endDate: '', days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], takenAtMeals: false
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch('/server/user/information', {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'x-user-id': user.id
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user?.meal_times) {
                    setUserMealTimes({
                        breakfast: data.user.meal_times.breakfast || '07:00',
                        lunch: data.user.meal_times.lunch || '12:00',
                        dinner: data.user.meal_times.dinner || '18:00'
                    });
                }
            })
            .catch(err => console.error("Error fetching meal times:", err));
    }, []);

    const dayMap = {
        'sun': 'sun', 'mon': 'mon', 'tue': 'tue', 'wed': 'wed',
        'thu': 'thu', 'fri': 'fri', 'sat': 'sat'
    };

    const daysOfWeek = [
        { id: 'sun', label: 'S' }, { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' },
        { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }
    ];

    const toggleTempMedDay = (dayId) => setTempMed(prev => ({...prev, days: prev.days.includes(dayId) ? prev.days.filter(d => d !== dayId) : [...prev.days, dayId]}));

    const calculateSchedule = (start, gap, max, atMeals) => {
        let m = parseInt(max, 10);
        if (atMeals) {
            if (isNaN(m) || m <= 0) m = 3;
            return [userMealTimes.breakfast, userMealTimes.lunch, userMealTimes.dinner].slice(0, m);
        }
        if (!start) return [];
        const times = [start];
        const g = parseInt(gap, 10);
        if (g > 0) {
            if (isNaN(m) || m <= 0) m = Math.floor(24 / g);
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

    const formatTimeAMPM = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        if (!m) return timeStr;
        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${m} ${ampm}`;
    };

    const handleAddMedicineToList = () => {
        if (tempMed.name.trim() !== '') {
            const calculatedTimes = calculateSchedule(tempMed.startTime, tempMed.hourlyGap, tempMed.maxPerDay, tempMed.takenAtMeals);
            setPrescriptionMeds([...prescriptionMeds, { ...tempMed, calculatedTimes }]);
            setTempMed({ name: '', dosage: '', type: 'Tablet', totalAmount: '', startTime: '08:00', hourlyGap: '', maxPerDay: '', startDate: '', endDate: '', days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], takenAtMeals: false });
        }
    };

    const handleSaveCompletePrescription = async () => {
        setLoading(true);
        try {
            const formattedMedsList = prescriptionMeds.map(med => ({
                name: med.name,
                strength: med.dosage,
                medicine_type: med.type,
                total_amount_prescribed: parseInt(med.totalAmount, 10) || 0,
                start_date: med.startDate,
                end_date: med.endDate,
                hourly_gap: med.hourlyGap ? parseInt(med.hourlyGap, 10) : null,
                max_per_day: med.maxPerDay ? parseInt(med.maxPerDay, 10) : 1,
                days_taken: med.days.map(d => dayMap[d.toLowerCase()] || d),
                start_time_per_day: med.startTime ? (med.startTime.length === 5 ? `${med.startTime}:00` : med.startTime) : (med.takenAtMeals ? `${userMealTimes.breakfast}:00` : null),
                notes: med.notes === '' ? null : med.notes
            }));

            const response = await fetch(`${API_BASE_URL}/prescription/add`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    doctor_name: docName,
                    doc_specialization: docSpec,
                    date_issued: new Date().toISOString().split('T')[0],
                    document_url: null,
                    meds_list: formattedMedsList
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.error || "Failed to save prescription.");

            closeModal();
            setTimeout(() => { window.location.reload(); }, 500);
        } catch (error) {
            console.error("Error saving prescription:", error);
            alert(`Could not save prescription: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const previewTimes = calculateSchedule(tempMed.startTime, tempMed.hourlyGap, tempMed.maxPerDay, tempMed.takenAtMeals);

    return (
        <div className="flex flex-col h-full p-6 pb-12">
            <div className="flex items-center gap-3 mb-6">
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 text-[#2081C3] hover:cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                )}
                <h2 className="text-2xl font-semibold text-[#2081C3]">{step === 1 ? 'Manual Prescription' : 'Add Medicines'}</h2>
            </div>

            {step === 1 && (
                <>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-500 font-semibold pl-1">Doctor Name</label>
                            <input type="text" value={docName} onChange={e=>setDocName(e.target.value)} placeholder="Dr. John Doe" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-500 font-semibold pl-1">Specialization</label>
                            <input type="text" value={docSpec} onChange={e=>setDocSpec(e.target.value)} placeholder="Cardiology" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#2081C3]" />
                        </div>
                    </div>
                    <div className="mt-8 pt-2">
                        <button onClick={() => setStep(2)} className="w-full py-4 bg-[#2081C3] text-white rounded-xl shadow-lg active:scale-95 transition-all text-lg font-semibold hover:cursor-pointer">Proceed to Add Medicines</button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                        {prescriptionMeds.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 font-semibold pl-1">Medicines in this Prescription:</p>
                                {prescriptionMeds.map((med, idx) => (
                                    <div key={idx} className="bg-[#E8F4FA] border border-[#2081C3]/30 p-3 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{med.name}</p>
                                            <p className="text-xs text-gray-600">{med.dosage} • {med.type} • Total: {med.totalAmount}</p>
                                            <p className="text-xs font-semibold text-[#2081C3] mt-1">
                                                {med.takenAtMeals ? `With ${med.calculatedTimes.length} Meal(s)` : med.calculatedTimes.map(formatTimeAMPM).join(', ')}
                                            </p>
                                            {med.notes && <p className="text-[10px] text-[#2081C3] italic mt-0.5">Note: {med.notes}</p>}
                                            <p className="text-[10px] text-gray-500 mt-0.5">{med.days.length === 7 ? 'Everyday' : med.days.map(d => d.charAt(0).toUpperCase() + d.slice(1,3)).join(', ')}</p>
                                        </div>
                                        <button onClick={() => setPrescriptionMeds(prescriptionMeds.filter((_, i) => i !== idx))} className="w-10 h-10 bg-white border border-red-100 rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-50 active:scale-95 transition-all shrink-0 ml-2 hover:cursor-pointer">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                ))}
                                <hr className="border-gray-200 my-4"/>
                            </div>
                        )}

                        <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-[#2081C3] font-semibold">Add New Medicine</h3>
                            <div className="flex flex-col gap-3">
                                <input type="text" placeholder="Medicine Name" value={tempMed.name} onChange={(e) => setTempMed({...tempMed, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Dosage (e.g. 500mg)" value={tempMed.dosage} onChange={(e) => setTempMed({...tempMed, dosage: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                                    <div className="relative">
                                        <select value={tempMed.type} onChange={(e) => setTempMed({...tempMed, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-[#2081C3] text-gray-700 hover:cursor-pointer">
                                            <option>Tablet</option><option>Capsule</option><option>Powder</option><option>Liquid</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 mt-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Total Prescribed Amount</label>
                                    <input type="number" placeholder="e.g. 30 pieces" value={tempMed.totalAmount} onChange={(e) => setTempMed({...tempMed, totalAmount: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Start Date</label>
                                        <input type="date" value={tempMed.startDate} onChange={(e) => setTempMed({...tempMed, startDate: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700 hover:cursor-pointer" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">End Date</label>
                                        <input type="date" value={tempMed.endDate} onChange={(e) => setTempMed({...tempMed, endDate: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700 hover:cursor-pointer" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 pt-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Days to Take</label>
                                    <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
                                        {daysOfWeek.map(day => (
                                            <button key={day.id} onClick={() => toggleTempMedDay(day.id)} className={`w-8 h-8 rounded-full font-semibold text-[11px] transition-all hover:cursor-pointer ${tempMed.days.includes(day.id) ? 'bg-[#2081C3] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-100'}`}>
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
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setTempMed({
                                                ...tempMed,
                                                takenAtMeals: isChecked,
                                                notes: isChecked ? "Should be taken at meal times" : tempMed.notes //
                                            });
                                        }}
                                        className="w-4 h-4 text-[#2081C3] bg-gray-50 border-gray-300 rounded focus:ring-[#2081C3] cursor-pointer"
                                    />
                                    <label htmlFor="takenAtMeals" className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">Taken at meals</label>
                                </div>

                                {/* Editable Notes Field */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Special Instructions / Notes</label>
                                    <textarea
                                        value={tempMed.notes}
                                        onChange={(e) => setTempMed({...tempMed, notes: e.target.value})}
                                        placeholder="e.g. Do not crush tablet, avoid dairy..."
                                        rows="2"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    <div className="flex flex-col gap-1">
                                        <label className={`text-[10px] font-semibold uppercase tracking-wider pl-1 ${tempMed.takenAtMeals ? 'text-gray-300' : 'text-gray-500'}`}>First Dose</label>
                                        <input type="time" value={tempMed.startTime} onChange={(e) => setTempMed({...tempMed, startTime: e.target.value})} disabled={tempMed.takenAtMeals} className={`w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#2081C3] ${tempMed.takenAtMeals ? 'opacity-40 cursor-not-allowed' : 'hover:cursor-pointer shadow-sm'}`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className={`text-[10px] font-semibold uppercase tracking-wider pl-1 ${tempMed.takenAtMeals ? 'text-gray-300' : 'text-gray-500'}`}>Gap (hrs)</label>
                                        <input type="number" placeholder="e.g. 8" value={tempMed.hourlyGap} onChange={(e) => setTempMed({...tempMed, hourlyGap: e.target.value})} disabled={tempMed.takenAtMeals} className={`w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] ${tempMed.takenAtMeals ? 'opacity-40 cursor-not-allowed' : 'shadow-sm'}`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pl-1">Max / Day</label>
                                        <input type="number" placeholder="e.g. 3" value={tempMed.maxPerDay} onChange={(e) => setTempMed({...tempMed, maxPerDay: e.target.value})} className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2081C3] shadow-sm text-gray-700" />
                                    </div>
                                </div>
                                <div className="bg-[#F7F9F9] rounded-lg p-2 text-center border border-gray-100 mt-1">
                                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Generated Schedule</p>
                                    <p className="text-[#2081C3] font-bold text-sm mt-1">
                                        {tempMed.takenAtMeals ? `With ${parseInt(tempMed.maxPerDay, 10) || 3} Meal(s)` : (previewTimes.length > 0 ? previewTimes.map(formatTimeAMPM).join(' → ') : '--:--')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleAddMedicineToList} disabled={!tempMed.name} className={`w-full py-3 mt-4 rounded-xl font-semibold transition-all ${tempMed.name ? 'bg-[#63D2FF] text-white active:scale-95 shadow-md hover:cursor-pointer' : 'bg-gray-100 text-gray-400'}`}>
                                + Add to List
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-white">
                        <button onClick={handleSaveCompletePrescription} disabled={prescriptionMeds.length === 0 || loading} className={`w-full py-4 rounded-xl shadow-lg transition-all text-lg font-semibold ${prescriptionMeds.length > 0 ? 'bg-[#2081C3] text-white active:scale-95 hover:cursor-pointer' : 'bg-gray-300 text-gray-500 disabled:cursor-not-allowed'}`}>
                            {loading ? 'Saving...' : 'Save Complete Prescription'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function ScanPrescriptionView({ closeModal }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useState(null)[1];
    const inputRef = useState(null)[0];

    // Auto-trigger file picker on mount
    useState(() => {
        const fileInput = document.getElementById('prescription-file-input');
        if (fileInput) fileInput.click();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearAndReupload = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('prescription-file-input');
        if (fileInput) fileInput.click();
    };

    const handleConfirmUpload = () => {
        if (selectedFile) {
            console.log('Uploading prescription:', selectedFile);
            // TODO: Send file to backend /server/ocr/parse or /server/prescription/add
            closeModal();
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-black relative">
            {/* Hidden File Input */}
            <input
                id="prescription-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {!selectedFile ? (
                // Upload Prompt State
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#63D2FF]/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#63D2FF]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z"></path>
                        </svg>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white text-lg font-semibold mb-2">Select Prescription Image</h3>
                        <p className="text-white/60 text-sm">
                            Choose a photo or scan of your prescription.<br/>
                            MoniMed will automatically extract the details.
                        </p>
                    </div>
                    <button
                        onClick={() => document.getElementById('prescription-file-input').click()}
                        className="px-8 py-3 bg-[#63D2FF] text-black rounded-xl font-semibold hover:bg-[#78D5D7] active:scale-95 transition-all shadow-lg"
                    >
                        Browse Files
                    </button>
                </div>
            ) : (
                // Image Preview State
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden bg-black border-2 border-[#63D2FF]/50">
                        <img src={previewUrl} alt="Prescription" className="w-full h-full object-contain" />
                    </div>

                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#63D2FF]/30">
                        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">File Selected</p>
                        <p className="text-white font-semibold text-sm truncate">{selectedFile.name}</p>
                        <p className="text-white/50 text-xs mt-1">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleClearAndReupload}
                            className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 active:scale-95 transition-all"
                        >
                            Choose Another
                        </button>
                        <button
                            onClick={handleConfirmUpload}
                            className="flex-1 py-3 bg-[#63D2FF] text-black rounded-xl font-semibold hover:bg-[#78D5D7] active:scale-95 transition-all shadow-lg"
                        >
                            Confirm & Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
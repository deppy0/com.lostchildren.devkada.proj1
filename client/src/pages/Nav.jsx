import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/homeIcon.svg';
import healthIcon from '../assets/healthIcon.svg';
import prescriptionIcon from '../assets/prescriptionIcon.svg';
import inventoryIcon from '../assets/inventoryIcon.svg';
import profileIcon from '../assets/profileIcon.svg';

// Helper component reverted to standard styling
const ActionButton = ({ title, fullWidth }) => (
    <button
        className={`bg-[#63D2FF] bg-opacity-80 hover:bg-opacity-100 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors ${
            fullWidth ? 'col-span-2' : ''
        }`}
    >
        {/* Standard inner icon circle */}
        <div className="w-12 h-12 rounded-full bg-[#BED8D4] bg-opacity-70"></div>
        <span className="text-[#F7F9F9] text-sm font-medium font-k2d text-center leading-tight">
            {title}
        </span>
    </button>
);

export default function Nav({ activeTab }) {
    const [fabOpen, setFabOpen] = useState(false);

    // Initialize the navigation hook
    const navigate = useNavigate();

    // Helper function to handle routing and close the FAB menu if it was open
    const handleNavigation = (path) => {
        navigate(path);
        setFabOpen(false);
    };

    return (
        <>
            {/* --- Blurred Overlay --- */}
            <div
                className={`fixed inset-0 bg-[#F7F9F9]/20 backdrop-blur-md z-40 transition-opacity duration-500 ease-in-out ${
                    fabOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setFabOpen(false)}
            />

            {/* --- Main Expanding Nav Container --- */}
            <nav
                className={`fixed bottom-0 w-full max-w-md mx-auto inset-x-0 bg-[#2081C3] rounded-t-[2.5rem] transition-all duration-500 ease-in-out z-50 flex flex-col shadow-2xl ${
                    fabOpen ? 'h-[70vh]' : 'h-24'
                }`}
            >
                {/* 1. Closed State: Navigation Icons */}
                <div
                    className={`absolute bottom-0 w-full h-24 px-4 flex justify-around items-center transition-all duration-300 ${
                        fabOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 delay-200 translate-y-0'
                    }`}
                >
                    <button onClick={() => handleNavigation('/home')} className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === 'home' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={homeIcon} alt="Home" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/health')} className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === 'health' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={healthIcon} alt="Health" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/prescription')} className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === 'prescription' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={prescriptionIcon} alt="Prescription" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/inventory')} className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === 'inventory' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={inventoryIcon} alt="Inventory" className="w-8 h-8" />
                    </button>
                    <button onClick={() => handleNavigation('/profile')} className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === 'profile' ? 'bg-[#78D5D7]' : 'bg-transparent'}`}>
                        <img src={profileIcon} alt="Profile" className="w-8 h-8" />
                    </button>
                </div>

                {/* 2. Open State: FAB Menu Content */}
                <div
                    className={`w-full h-full pt-8 px-6 transition-all duration-500 ease-in-out overflow-y-auto pb-24 ${
                        fabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                >
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {/* Updated Button: Standard styling, spans both columns */}
                        <ActionButton title="Take Medicine" fullWidth />

                        {/* Standard Actions */}
                        <ActionButton title="Add Medicine" />
                        <ActionButton title="Update BP" />
                        <ActionButton title="Scan Prescription" fullWidth />
                        <ActionButton title="Add Prescription" />
                        <ActionButton title="Add Medication" />
                    </div>
                </div>
            </nav>

            {/* --- Floating Action Button (FAB) --- */}
            <div className="fixed inset-x-0 bottom-0 w-full max-w-md mx-auto pointer-events-none z-[999]">
                <button
                    onClick={() => setFabOpen(!fabOpen)}
                    className={`absolute right-6 w-16 h-16 bg-[#78D5D7] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] text-[#F7F9F9] text-4xl pb-2 font-k2d font-semibold transition-all duration-500 ease-in-out pointer-events-auto border border-[#BED8D4] ${
                        fabOpen
                            ? 'bottom-8 rotate-[135deg] bg-opacity-90'
                            : 'bottom-[5.5rem] rotate-0'
                    }`}
                >
                    +
                </button>
            </div>
        </>
    );
}
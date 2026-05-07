import { useState, useEffect, useCallback } from 'react';
import '../css/Home.css';
import '../css/Font.css';

// Import icons from assets folder
import capsuleIcon from '../assets/capsule_icon.png';
import inhalerIcon from '../assets/inhaler_icon.png';
import pillIcon from '../assets/pill_icon.png';
import tabletIcon from '../assets/tablet_icon.png';
import syrupIcon from '../assets/syrup_icon.png';
import powderIcon from '../assets/powder_icon.png';

const API_BASE_URL = '/server';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

// Helper function to render an icon based on medicine type
const getMedicineIcon = (type) => {
    const medType = (type || '').toLowerCase();

    if (medType.includes('capsule')) {
        return <img src={capsuleIcon} alt="Capsule" className="w-8 h-8 object-contain" />;
    }
    if (medType.includes('inhaler')) {
        return <img src={inhalerIcon} alt="Inhaler" className="w-8 h-8 object-contain" />;
    }
    if (medType.includes('pill')) {
        return <img src={pillIcon} alt="Pill" className="w-8 h-8 object-contain" />;
    }
    if (medType.includes('tablet')) {
        return <img src={tabletIcon} alt="Tablet" className="w-8 h-8 object-contain" />;
    }
    if (medType.includes('syrup') || medType.includes('liquid') || medType.includes('drops')) {
        return <img src={syrupIcon} alt="Syrup" className="w-8 h-8 object-contain" />;
    }
    if (medType.includes('powder')) {
        return <img src={powderIcon} alt="Powder" className="w-8 h-8 object-contain" />;
    }

    // Default generic medical/cross icon fallback
    return (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
};

// Helper function to format strength with units
const formatStrength = (strength, type) => {
    if (!strength) return '';
    const medType = (type || '').toLowerCase();
    const strStrength = String(strength).toLowerCase();

    let unit = '';
    if ((medType.includes('syrup') || medType.includes('liquid') || medType.includes('drops')) && !strStrength.includes('ml')) {
        unit = 'ml';
    } else if (medType.includes('powder') && !strStrength.includes('mg')) {
        unit = 'mg';
    }

    return `(${strength}${unit})`;
};

// Helper function to determine the appropriate stock unit display
const getStockUnit = (type) => {
    const medType = (type || '').toLowerCase();
    if (medType.includes('syrup') || medType.includes('liquid') || medType.includes('drops')) {
        return 'ml';
    }
    if (medType.includes('powder')) {
        return 'mg';
    }
    return '';
};

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [subtractAmount, setSubtractAmount] = useState('1');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch inventory on mount (wrapped in useCallback to fix ESLint warning)
    const fetchInventory = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/medicine/get`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({})
            });
            const data = await response.json();

            if (response.ok && data.success && data.medicines) {
                setInventoryItems(data.medicines);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // 2. Open the Slide Modal
    const handleOpenModal = (e, item) => {
        e.stopPropagation();
        if ((item.stock_remaining || 0) <= 0) return;

        setSelectedItem(item);
        setSubtractAmount('1');
    };

    // 3. Confirm and Send to Backend
    const handleConfirmSubtract = async () => {
        if (!selectedItem) return;

        const amountToSubtract = parseInt(subtractAmount, 10);
        const currentStock = selectedItem.stock_remaining || 0;

        if (isNaN(amountToSubtract) || amountToSubtract <= 0) {
            alert("Please enter a valid number greater than 0.");
            return;
        }

        if (amountToSubtract > currentStock) {
            alert(`You cannot subtract ${amountToSubtract}. You only have ${currentStock} left in stock.`);
            return;
        }

        setIsSubmitting(true);

        // Optimistic UI update for instant feedback
        setInventoryItems(prevItems =>
            prevItems.map(item =>
                item.id === selectedItem.id
                    ? { ...item, stock_remaining: item.stock_remaining - amountToSubtract }
                    : item
            )
        );

        // Send the exact amount to the backend
        try {
            const response = await fetch(`${API_BASE_URL}/medicine/subtract-stocks`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    medicine_id: selectedItem.id,
                    subtract_amount: amountToSubtract
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                // Revert on failure
                fetchInventory();
                throw new Error(data.error || "Failed to subtract stock");
            }

            setSelectedItem(null);
        } catch (error) {
            console.error("Error subtracting stock:", error);
            alert(`Could not subtract stock: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredInventory = inventoryItems.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="relative mx-auto w-full max-w-md h-[100dvh] bg-[#F7F9F9] overflow-hidden font-k2d text-gray-900">
            <div className="h-full overflow-y-auto pb-32">
                <div className="bg-[#2081C3] pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm">
                    <p className="text-white/80 text-sm font-k2d font-extralight mb-1">{todayFormatted}</p>
                    <h1 className="text-white text-[2.5rem] font-k2d font-semibold mb-6 tracking-wide leading-none">
                        Inventory
                    </h1>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for Medicine"
                            className="w-full bg-[#F7F9F9] text-gray-700 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#63D2FF] shadow-inner placeholder-gray-400 text-sm font-k2d"
                        />
                    </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-6">
                    {filteredInventory.length === 0 ? (
                        <div className="col-span-2 text-center text-gray-500 py-8 font-k2d font-light">
                            No medicines found in inventory.
                        </div>
                    ) : (
                        filteredInventory.map((item) => (
                            <div key={item.id} className="flex flex-col cursor-pointer group">
                                <div
                                    className={`relative ${item.color || 'bg-[#BED8D4]'} rounded-2xl p-4 flex flex-col items-center justify-center h-36 transition-transform duration-200 group-hover:scale-[1.02] border border-[#2081C3]`}
                                >
                                    <button
                                        onClick={(e) => handleOpenModal(e, item)}
                                        disabled={(item.stock_remaining || 0) <= 0}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white/40 hover:bg-white/70 active:bg-white border border-[#2081C3]/30 rounded-full flex items-center justify-center text-[#2081C3] font-bold text-lg pb-1 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                                        title="Subtract specific amount"
                                    >
                                        -
                                    </button>

                                    {/* Icon Container replacing solid gray box */}
                                    <div className="w-14 h-14 rounded-full bg-[#2081C3]/90 flex items-center justify-center mb-3 shadow-inner">
                                        {getMedicineIcon(item.medicine_type)}
                                    </div>

                                    <span className="text-xl font-k2d font-semibold text-gray-800 leading-none mb-1 flex items-baseline gap-0.5">
                                        {item.stock_remaining || 0} <span className="text-[13px]">{getStockUnit(item.medicine_type)}</span>
                                    </span>
                                    <span className="text-[10px] font-k2d font-extralight text-gray-500 uppercase tracking-wider">
                                        in stock
                                    </span>
                                </div>
                                <div className="pt-2 px-1">
                                    <h3 className="font-k2d font-semibold text-gray-900 text-lg leading-tight mb-0.5 capitalize">
                                        {item.name}
                                    </h3>
                                    <p className="text-[11px] font-k2d font-extralight text-gray-500 capitalize">
                                        {item.medicine_type || 'Unknown'} {formatStrength(item.strength, item.medicine_type)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 ${selectedItem ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSelectedItem(null)}
            />

            <div className={`fixed bottom-0 inset-x-0 w-full max-w-md mx-auto bg-white rounded-t-3xl z-[1001] transition-transform duration-500 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${
                selectedItem ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className={`w-full flex justify-center pt-5 pb-5 rounded-t-3xl relative bg-[#2081C3] text-white`}>
                    <div className="w-12 h-1.5 bg-white/50 rounded-full absolute top-3"></div>
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute right-4 top-3 w-10 h-10 bg-[#78D5D7] border-2 border-[#BED8D4] rounded-full flex items-center justify-center shadow-lg text-[#F7F9F9] hover:scale-105 active:scale-95 transition-all z-10 hover:cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4 font-k2d pb-10 bg-[#F7F9F9]">
                    <div>
                        <h2 className="text-2xl font-semibold text-[#2081C3] capitalize">{selectedItem?.name}</h2>
                        <p className="text-sm text-gray-500 font-semibold">
                            Current Stock: <span className="text-gray-800">{selectedItem?.stock_remaining} {getStockUnit(selectedItem?.medicine_type)}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm text-gray-500 font-semibold pl-1">Amount to Subtract</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedItem?.stock_remaining}
                            value={subtractAmount}
                            onChange={(e) => setSubtractAmount(e.target.value)}
                            placeholder={`e.g. 1 or 5 ${getStockUnit(selectedItem?.medicine_type)}`}
                            className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-[#2081C3] shadow-sm"
                        />
                    </div>

                    <button
                        onClick={handleConfirmSubtract}
                        disabled={isSubmitting || !subtractAmount || parseInt(subtractAmount, 10) <= 0 || parseInt(subtractAmount, 10) > selectedItem?.stock_remaining}
                        className={`w-full py-4 mt-6 rounded-xl shadow-lg transition-all text-lg font-semibold ${
                            subtractAmount && parseInt(subtractAmount, 10) > 0 && parseInt(subtractAmount, 10) <= selectedItem?.stock_remaining
                                ? 'bg-[#2081C3] text-white active:scale-95 hover:cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Updating...' : 'Confirm Subtraction'}
                    </button>
                </div>
            </div>
        </div>
    );
}
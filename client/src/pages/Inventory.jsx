import '../css/Home.css';
import '../css/Font.css';

export default function Inventory() {
    // Array containing the medicine data and their specific color codes
    const inventoryItems = [
        { id: 1, name: 'Biogesic', type: 'Tablet (40mg)', stock: '10', unit: 'in stock', color: 'bg-[#78D5D7]', selected: true },
        { id: 2, name: 'Meth', type: 'Powder (40mg)', stock: '400 mg', unit: 'in stock', color: 'bg-[#BED8D4]' },
        { id: 3, name: 'Amoxicillin', type: 'Capsule', stock: '15', unit: 'in stock', color: 'bg-[#A8E6E1]' },
        { id: 4, name: 'Vitamin C', type: 'Tablet (500mg)', stock: '30', unit: 'in stock', color: 'bg-[#C8E9E8]' },
        { id: 5, name: 'Ibuprofen', type: 'Tablet (200mg)', stock: '12', unit: 'in stock', color: 'bg-[#7FD8D8]' },
        { id: 6, name: 'Lisinopril', type: 'Tablet (10mg)', stock: '5', unit: 'in stock', color: 'bg-[#B3E5FC]' },
    ];

    return (
        // Main App Container: Locks to mobile width and viewport height
        <div className="relative mx-auto w-full max-w-md h-[100dvh] bg-[#F7F9F9] overflow-hidden font-k2d text-gray-900">

            {/* Scrollable Content Area */}
            <div className="h-full overflow-y-auto pb-32">

                {/* --- Header Section --- */}
                <div className="bg-[#2081C3] pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm">
                    <p className="text-white/80 text-sm font-k2d font-extralight mb-1">Monday, May 4</p>
                    <h1 className="text-white text-[2.5rem] font-k2d font-semibold mb-6 tracking-wide leading-none">
                        Inventory
                    </h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for Medicine"
                            className="w-full bg-[#F7F9F9] text-gray-700 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#63D2FF] shadow-inner placeholder-gray-400 text-sm font-k2d"
                        />
                    </div>
                </div>

                {/* --- Inventory Grid --- */}
                <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-6">
                    {inventoryItems.map((item) => (
                        <div key={item.id} className="flex flex-col cursor-pointer group">

                            {/* Top Colored Card Section */}
                            <div
                                className={`${item.color} rounded-2xl p-4 flex flex-col items-center justify-center h-36 transition-transform duration-200 group-hover:scale-[1.02] border border-[#2081C3] ${
                                    item.selected ? 'ring-2 ring-[#63D2FF] ring-offset-2 ring-offset-[#F7F9F9]' : ''
                                }`}
                            >
                                {/* Dark Gray Circle Placeholder for Icon/Image */}
                                <div className="w-14 h-14 rounded-full bg-gray-500/80 mb-3"></div>
                                <span className="text-xl font-k2d font-semibold text-gray-800 leading-none mb-1">
                                    {item.stock}
                                </span>
                                <span className="text-[10px] font-k2d font-extralight text-gray-500 uppercase tracking-wider">
                                    {item.unit}
                                </span>
                            </div>

                            {/* Bottom Text Details */}
                            <div className="pt-2 px-1">
                                <h3 className="font-k2d font-semibold text-gray-900 text-lg leading-tight mb-0.5">
                                    {item.name}
                                </h3>
                                <p className="text-[11px] font-k2d font-extralight text-gray-500">
                                    {item.type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
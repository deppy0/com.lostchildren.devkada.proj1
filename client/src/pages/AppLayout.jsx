import { useLocation, Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';

export default function AppLayout() {
    const location = useLocation();

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('health')) return 'health';
        if (path.includes('prescription')) return 'prescription';
        if (path.includes('inventory')) return 'inventory';
        if (path.includes('profile')) return 'profile';
        return 'home';
    };

    const activeTab = getActiveTab();

    console.log('Current path:', location.pathname); // Debug

    return (
        <div className="max-w-md mx-auto min-h-[100dvh] bg-[#F7F9F9] relative overflow-hidden font-k2d sm:border sm:border-gray-200 sm:rounded-3xl sm:shadow-2xl sm:h-[850px] sm:my-8">
            <div className="h-full overflow-y-auto">
                <Outlet />
            </div>
            <Nav activeTab={activeTab} />
        </div>
    );
}
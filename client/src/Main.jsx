import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import your components
import Index from './pages/Index.jsx';
import Signup from './pages/Signup.jsx';
import AppLayout from './pages/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Inventory from './pages/Inventory.jsx';
import Prescription from './pages/Prescription.jsx';
import Profile from './pages/Profile.jsx';
import PatientInfo from './pages/Patient-Info.jsx';
import CaregiverInfo from './pages/Caregiver-Info.jsx';
import ChangePassword from './pages/Change-Password.jsx';
import NotificationSettings from './pages/Notification-Settings.jsx';
import Privacy from './pages/Privacy.jsx';
import HealthRecord from "./pages/HealthRecord.jsx";

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((error) => {
			console.error('Service worker registration failed:', error);
		});
	});
}

// Define the routing structure
const router = createBrowserRouter([
	{
		path: '/',
		element: <Index />, // Login page is the default route
	},
	{
		path: '/signup',
		element: <Signup />,
	},
	{
		// AppLayout wraps all authenticated routes so they share the Nav bar
		element: <AppLayout />,
		children: [
			{
				path: '/home',
				element: <Home />,
			},
			{
				path: '/inventory',
				element: <Inventory />,
			},
			{
				path: '/prescription',
				element: <Prescription />,
			},
			// You can add /health and /profile here later
			{
				path: '/health',
				element: <HealthRecord />,
			},
			{
				path: '/profile',
				element: <Profile />,
			},
			{
				path: '/profile/patient',
				element: <PatientInfo />,
			},
			{
				path: '/profile/caregiver',
				element: <CaregiverInfo />,
			},
			{
				path: '/profile/password',
				element: <ChangePassword />,
			},
			{
				path: '/profile/notification',
				element: <NotificationSettings />,
			},
			{
				path: '/profile/privacy',
				element: <Privacy />,
			},
		],
	},
]);

createRoot(document.getElementById('main')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
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
		],
	},
]);

createRoot(document.getElementById('main')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
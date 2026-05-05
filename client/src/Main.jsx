import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import Index from './pages/Index.jsx';
import Signup from './pages/Signup.jsx';
//import Home from './pages/Home.jsx';

const Router = createHashRouter([
	{ path: '/', element: <Index /> },
	{ path: '/signup', element: <Signup />},
	{ path: '*', element: <Navigate to='/' replace /> },
]);

createRoot(document.getElementById('main')).render(
	<StrictMode>
		<RouterProvider router={Router} />
	</StrictMode>
);

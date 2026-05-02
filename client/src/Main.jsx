import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import Index from './Index.jsx';

const Router = createHashRouter([
	{ path: '/', element: <Index /> },
	{ path: '*', element: <Navigate to='/' replace /> },
]);

createRoot(document.getElementById('main')).render(
	<StrictMode>
		<RouterProvider router={Router} />
	</StrictMode>
);

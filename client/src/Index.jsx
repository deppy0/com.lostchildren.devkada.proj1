import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Index.css';

export default function Index() {
	const [port, setPort] = useState('port');
	useEffect(() => {
		(async () => {
			const response = await axios.get('/server/example/port');
			setPort(response.data.port);
		})();
	}, []);
	return <p className="font-thin font-mono">Hello from :5173 and :{port}</p>;
}

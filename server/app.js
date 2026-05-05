const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);

const supabase = require('./database/supabase');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/server/example', require('./routes/example'));
app.use('/server/user', require('./routes/userRoutes'));
app.use('/server/auth', require('./routes/auth'));
app.use('/server/prescription', require('./routes/prescription'));
app.use('/server/medicine', require('./routes/medicine'));
app.use('/server/schedule', require('./routes/schedule'));
app.use('/server/ocr', require('./routes/ocrRoutes'));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
	app.get('/*redir', function(req, res) {
		res.sendFile(path.join(__dirname, '../client/dist/index.html'));
	});
} else {
	console.log(process.env.NODE_ENV);
}
app.listen(process.env.PORT, function() {
	console.log(process.env.PORT);
});

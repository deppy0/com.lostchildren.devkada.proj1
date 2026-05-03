const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);

/*const database = require('./database');*/
const supabase = require('./database/supabase');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/server/example', require('./routes/example'));

/*
database.connect().then(function(msg) {
	if (msg.success) {
		if (process.env.NODE_ENV === 'production') {
			app.use(express.static(path.join(__dirname, '../client/dist')));
			app.get('/*redir', function(req, res) { res.redirect('/'); });
		} else {
			console.log(process.env.NODE_ENV);
		}
		app.listen(process.env.PORT, function() {
			console.log(process.env.PORT);
		});
	} else {
		console.log('Could not connect to MongoDB');
		console.log(msg.error);
		process.exit(1);
	}
});
*/

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
	app.get('/*redir', function(req, res) { res.redirect('/'); });
} else {
	console.log(process.env.NODE_ENV);
}
app.listen(process.env.PORT, function() {
	console.log(process.env.PORT);
});

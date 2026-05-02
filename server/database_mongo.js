const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const MONGODB_MAIN = process.env.MONGODB_MAIN;

function connect() {
	return mongoose.connect(MONGODB_MAIN)
		.then(function() { return { success: true, }; })
		.catch(function(error) { return { success: false, error: error.message, }; });
}

module.exports.connect = connect;

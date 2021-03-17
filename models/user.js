const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		maxlength: 100,
	},
	password: {
		type: String,
		required: true,
		maxlength: 100,
	},
	first_name: {
		type: String,
		required: true,
		maxlength: 100,
	},
	last_name: {
		type: String,
		required: true,
		maxlength: 100,
	},
	email: {
		type: String,
		required: true,
		maxlength: 100,
	},
	isOnline: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	user_name: {
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
	rooms: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Room',
		},
	],
	isOnline: {
		type: Boolean,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	//timeOnline?
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	message_content: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now(),
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');

router.get('/:id', ensureAuthenticated, (req, res) => {
	const { user } = req;
	const id = req.params.id;

	RoomModel.findOne({ name: id }).populate({ path: 'messages', populate: { path: 'author' } }).exec((error, room) => {
		if (error) {
			console.log(error);
		}
		const { messages } = room;
		res.render('chatroom', {
			user,
			messages,
			room,
		});
	});

});

router.delete('/deleteroom/:room/', (req, res) => {
	const roomId = req.params.room;
	RoomModel.deleteOne({ _id: roomId }).exec((error) => {
		if (error) {
			console.log(error);
		}
		res.end();
	});
});

module.exports = router;

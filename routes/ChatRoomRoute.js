const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');
const UserModel = require('../models/user');

router.get('/:id/:user', ensureAuthenticated, (req, res) => {
	const user = req.params.user;
	const id = req.params.id;

	RoomModel.findOne({ name: id }).exec((error, room) => {
		if (error) {
			console.log(error);
		}
		UserModel.findOne({ username: user }).exec((error, myUser) => {
			if (error) {
				console.log(error);
			}
			const isAdmin = room.admins.includes(myUser._id);
			res.render('chatroom', { room, myUser });
		});
	});
});

router.delete('/deleteroom/:room/:user', (req, res) => {
	const roomId = req.params.room;
	const userId = req.params.user;
	RoomModel.deleteOne({ _id: roomId }).exec((error) => {
		if (error) {
			console.log(error);
		}
		res.end();
	});
});

module.exports = router;

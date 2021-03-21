const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');

router.get('/:id', ensureAuthenticated, (req, res) => {
	const { user } = req;
	const id = req.params.id;

	RoomModel.findOne({ _id: id })
		.populate({ path: 'messages', populate: { path: 'author' } })
		.exec((error, room) => {
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

router.put('/', ensureAuthenticated, (req, res) => {
	const { admins, _id, name } = req.body;

	RoomModel.updateOne({ _id }, { admins, name }, (error) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		res.status(200).end();
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

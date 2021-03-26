const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');

//sends all data for current room
router.get('/:id', ensureAuthenticated, (req, res) => {
	const { user } = req;
	const id = req.params.id;

	RoomModel.findOne({ _id: id })
		.populate({ path: 'messages', populate: { path: 'author' } })
		.exec((error, room) => {
			if (error) {
				req.flash('error_msg', 'Oops! Something went wrong');
				res.status(400).redirect('/dashboard');
			}
			const { messages } = room;
			res.status(200).render('chatroom', {
				user,
				messages,
				room,
			});
		});
});

//updates the settings of a room
router.put('/', ensureAuthenticated, (req, res) => {
	const { admins, _id, name, isPrivate } = req.body;

	RoomModel.updateOne({ _id }, { admins, name, isPrivate }, (error) => {
		if (error) {
			throw error;
		}
		res.status(204).end();
	}).catch(() => {
		res.status(400).end();
	});
});

//deletes a room
router.delete('/deleteroom/:room/', (req, res) => {
	const roomId = req.params.room;

	RoomModel.deleteOne({ _id: roomId }).exec((error) => {
		if (error) {
			req.flash('error_msg', 'Oops! Something went wrong');
			res.status(400).end();
		}
		res.status(204).end();
	});
});

module.exports = router;

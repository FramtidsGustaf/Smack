const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const RoomModel = require('../models/room');

router.get('/allbutme', (req, res) => {
	const { user } = req;
	UserModel.find({ _id: { $nin: user._id } }).exec((error, users) => {
		if (users) {
			res.status(200).json(users);
		} else {
			res.status(404);
		}
	});
});

router.get('/roommembers/:_id', (req, res) => {
	const _id = req.params._id;
	RoomModel.findOne({ _id })
		.populate('users')
		.exec((error, room) => {
			if (room) {
				if (room.isPrivate) {
					res.status(200).json(room.users);
				} else {
					UserModel.find().exec((error, users) => {
						if (users) {
							res.status(200).json(users);
						} else {
							res.status(404);
						}
					});
				}
			} else {
				res.status(404);
			}
		});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const RoomModel = require('../models/room');
const userUpdater = require('../utils/userUpdater');

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
					res.status(200).json({users: room.users, room});
				} else {
					UserModel.find().exec((error, users) => {
						if (users) {
							res.status(200).json({users, room});
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

router.post('/closingwindow', (req, res) => {
	const { user } = req;

	userUpdater(true, user._id, 'isOnline', false, res);
});

router.post('/settoonline', (req, res) => {
	const { user } = req;

	userUpdater(true, user._id, 'isOnline', true, res);
});

module.exports = router;

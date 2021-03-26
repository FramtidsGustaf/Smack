const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room');
const { ensureAuthenticated } = require('../config/auth');
const userUpdater = require('../utils/userUpdater');

// render roomform to create new rooms
router.get('/roomform', ensureAuthenticated, (req, res) => {
	const userid = req.user._id;
	userUpdater(true, userid, 'isOnline', true);
	res.render('roomform', { userid });
});

// creates a new room and saves it to mongodb
router.post('/createroom', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	const { name, isPrivate, includedUsers } = req.body;

	const room = new RoomModel({
		name,
		admins: [_id],
		users: [...includedUsers, _id],
		isPrivate,
	});

	room.save((error) => {
		if (error) {
			res.status(400).end();
		}
	});
	res.status(204).end();
});

module.exports = router;

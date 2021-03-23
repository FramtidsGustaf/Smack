const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room');
const { ensureAuthenticated } = require('../config/auth');
const userUpdater = require('../utils/userUpdater');

router.get('/roomform', ensureAuthenticated, (req, res) => {
	const userid = req.user._id;
	userUpdater(true, userid, 'isOnline', true);
	res.render('roomform', { userid });
});

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
			return handleError(error);
		}
	});
	res.end();
});

module.exports = router;

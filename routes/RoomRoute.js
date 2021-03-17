const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room');
const { ensureAuthenticated } = require('../config/auth');

router.get('/roomform', ensureAuthenticated, (req, res) => {
	const userid = req.user._id;
	res.render('roomform', { userid });
});

router.post('/createroom', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	let { name, isPrivate } = req.body;
	console.log(isPrivate);
	isPrivate = isPrivate ? true : false;


	const room = new RoomModel({
		name,
		admins: [_id],
		users: [_id],
		isPrivate
	});

	room.save((error, result) => {
		if (error) {
			return handleError(error);
		}
		res.redirect('/dashboard');
	});
});

module.exports = router;

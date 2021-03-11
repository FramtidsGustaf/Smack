const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room');
const { ensureAuthenticated } = require('../config/auth');

router.post('/roomform', ensureAuthenticated, (req, res) => {
	const userid = req.body.userid;
	res.render('roomform', { userid });
});

router.post('/createroom', ensureAuthenticated, (req, res) => {
	const { name, userid } = req.body;

	const room = new RoomModel({
		name,
		admins: [userid],
	});

	room.save((error, result) => {
		if (error) {
			return handleError(error);
		}
		res.redirect('/dashboard');
	});
});

module.exports = router;

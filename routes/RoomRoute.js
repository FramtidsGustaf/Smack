const express = require('express');
const router = express.Router();
const RoomModel = require('../models/room');
const { ensureAuthenticated } = require('../config/auth');

router.get('/roomform', ensureAuthenticated, (req, res) => {
	res.render('roomform');
});

router.post('/createroom', ensureAuthenticated, (req, res) => {
	const room = new RoomModel(req.body);

	room.save((error, result) => {
		if (error) {
			return handleError(error);
		}
		res.redirect('/dashboard');
	});
});

module.exports = router;

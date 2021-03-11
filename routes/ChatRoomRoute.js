const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');

router.get('/:id', ensureAuthenticated, (req, res) => {
	RoomModel.findOne({ name: req.params.id }).exec((error, room) => {
		if (error) {
			console.log(error);
		}
		res.render('chatroom', room);
	});
});

module.exports = router;

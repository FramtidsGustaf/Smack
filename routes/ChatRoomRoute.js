const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const RoomModel = require('../models/room');

router.get('/:id', (req, res) => {
	RoomModel.findOne({ name: req.params.id }).exec((error, room) => {
		res.render('chatroom', room);
	});
});

module.exports = router;

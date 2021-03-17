const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

router.get('/allusers', (req, res) => {
	UserModel.find().exec((error, users) => {
		res.json(users);
	});
});

module.exports = router;

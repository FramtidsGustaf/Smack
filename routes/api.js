const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

router.get('/allbutme', (req, res) => {
	const { user } = req;
	UserModel.find({ _id: { $nin: user._id } }).exec((error, users) => {
		res.json(users);
	});
});

module.exports = router;

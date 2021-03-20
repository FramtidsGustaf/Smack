const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');
const updateUserStatus = require('../utils/status');

router.get('/:username', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	const username = req.params.username;

	updateUserStatus(true, _id, true);

	try {
		UserModel.findOne({ username }).exec((error, user) => {
			if (error) {
				throw error;
			}
			res.render('profile', { user });
		});
	} catch (error) {
		console.log(error);
		res.redirect('/dashboard');
	}
});

module.exports = router;

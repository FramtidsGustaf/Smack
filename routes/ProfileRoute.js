const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');
const userUpdater = require('../utils/userUpdater');

router.get('/:username', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	const username = req.params.username;

	userUpdater(true, _id, 'isOnline', true);

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

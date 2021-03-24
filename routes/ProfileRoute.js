const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');
const userUpdater = require('../utils/userUpdater');

//sends public data for a certain user
router.get('/:username', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	const username = req.params.username;

	userUpdater(true, _id, 'isOnline', true);

	UserModel.findOne({ username }, (error, user) => {
		if (error) {
			throw error;
		}
		res.status(200).render('profile', { user });
	}).catch(() => {
		res.status(400).redirect('/dashboard');
	});
});

module.exports = router;

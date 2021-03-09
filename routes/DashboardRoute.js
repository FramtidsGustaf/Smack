const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');

router.get('/', ensureAuthenticated, (req, res) => {
	res.render('dashboard', {
		user: req.user,
	});
});

router.post('/profile', ensureAuthenticated, (req, res) => {
	const { _id } = req.body;
	UserModel.findOne({ _id }).exec((error, user) => {
		res.render('profile', { user });
	});
});

router.post('/profile/update', ensureAuthenticated, async (req, res) => {
	const { _id, first_name, last_name, username, email, topsecret } = req.body;
	const userChanges = await UserModel.findOne({ _id });
	userChanges.overwrite({
		first_name,
		last_name,
		username,
		email,
		password: topsecret,
	});
	await userChanges.save();
	res.redirect('/dashboard');
});

module.exports = router;

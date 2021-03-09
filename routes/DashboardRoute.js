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

module.exports = router;

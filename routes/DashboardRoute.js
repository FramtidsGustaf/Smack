const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');
const RoomModel = require('../models/room');

router.get('/', ensureAuthenticated, (req, res) => {
	const { user } = req;
	RoomModel.find({
		$or: [{ isPrivate: false }, { users: { $all: [user._id] } }],
	}).exec((error, rooms) => {
		res.render('dashboard', {
			user,
			rooms,
		});
	});
	// UserModel.updateOne({ _id: user._id }, { isOnline: true }, (error) => {
	// 	if (error) {
	// 		console.log(error);
	// 	}
	// });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
	const { user } = req;
	res.render('profile', { user });
});

router.post('/profile/update', ensureAuthenticated, async (req, res) => {
	const { _id, password } = req.user;
	const { first_name, last_name, username, email } = req.body;
	const userChanges = await UserModel.findOne({ _id });
	userChanges.overwrite({
		first_name,
		last_name,
		username,
		email,
		password,
	});
	await userChanges.save();
	res.redirect('/dashboard');
});

module.exports = router;

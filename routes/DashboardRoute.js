const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const UserModel = require('../models/user');
const RoomModel = require('../models/room');
const userUpdater = require('../utils/userUpdater');

// Renders the dashboard with all rooms user is asigned to
router.get('/', ensureAuthenticated, (req, res) => {
	const { user } = req;
	userUpdater(true, user._id, 'isOnline', true);
	RoomModel.find(
		{
			$or: [{ isPrivate: false }, { users: { $all: [user._id] } }],
		},
		(error, rooms) => {
			if (error) {
				throw error;
			}
			res.render('dashboard', {
				user,
				rooms,
			});
		}
	).catch(() => {
		res.status(400).end();
	});
});

// Renders the users profile
router.get('/profile', ensureAuthenticated, (req, res) => {
	const { user } = req;
	userUpdater(true, user._id, 'isOnline', true, res);
	res.render('profileSettings', { user });
});

// Route for updating the user
router.post('/profile/update', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	const { first_name, last_name, username, email } = req.body;
	UserModel.updateOne(
		{ _id },
		{ first_name, last_name, username, email },
		(error) => {
			if (error) {
				throw error;
			}
			res.status(204).redirect('/dashboard/profile');
		}
	).catch(() => {
		res.status(400).redirect('/dashboard/profile');
	});
});

module.exports = router;

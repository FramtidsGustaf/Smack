const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const passport = require('passport');
const userUpdater = require('../utils/userUpdater');

router.get('/userform', (req, res) => {
	res.render('userform');
});

router.get('/signin', (req, res) => {
	res.render('signin');
});

router.get('/signout', (req, res) => {
	const { user } = req;
	req.logout();
	req.flash('success_msg', 'Signed Out');

	userUpdater(true, user._id, 'isOnline', false);

	res.redirect('/');
});

router.post('/signup', (req, res) => {
	const { first_name, last_name, username, email, password } = req.body;
	let errors = [];

	// check all fields are filled???
	if (!first_name || !last_name || !username || !email || !password) {
		errors.push({ msg: 'Enter all fields please' });
	}

	// password must be 6 char long
	if (password.length < 6) {
		errors.push({ msg: 'Password must be atleast 6 character long' });
	}

	// check if errors else register user
	UserModel.findOne({ email }).exec((error, userByMail) => {
		UserModel.findOne({ username }).exec((error, userByUserName) => {
			if (userByMail && userByUserName) {
				errors.push({ msg: 'Email and Username already registerd' });
				res.render('userform', { errors, first_name, last_name, username });
			} else if (userByUserName) {
				errors.push({ msg: 'Username already registerd' });
				res.render('userform', { errors, first_name, last_name, username });
			} else if (userByMail) {
				errors.push({ msg: 'Email already registerd' });
				res.render('userform', { errors, first_name, last_name, username });
			} else {
				const newUser = new UserModel(req.body);
				bcrypt.genSalt(10, (error, salt) => {
					bcrypt.hash(newUser.password, salt, (error, hash) => {
						if (error) {
							throw error;
						}
						newUser.password = hash;
						newUser.save().then((value) => {
							req.flash('success_msg', 'You have now registered!');
							res.redirect('/');
						});
					});
				});
			}
		});
	});

	if (errors.length > 0) {
		res.render('userform', { errors, first_name, last_name, username, email });
	}
});

router.post('/signin', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/user/signin',
		failureFlash: true,
		failureFlash: 'Invalid username or password',
	})(req, res, next);
});

module.exports = router;

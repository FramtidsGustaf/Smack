const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');
const userUpdater = require('../utils/userUpdater');

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: (req, file, callback) => {
		callback(
			null,
			file.fieldname + '-' + req.user._id + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1000000,
	},
	fileFilter: (req, file, callback) => {
		checkFileType(file, callback);
	},
}).single('profilePic');

const checkFileType = (file, callback) => {
	const fileTypes = /jpeg|jpg|png|gif/;
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);

	if (extname && mimetype) {
		return callback(null, true);
	} else {
		callback('Error: Images Only!');
	}
};

router.get('/', ensureAuthenticated, (req, res) => {
	res.render('profilepic');
});

router.post('/update', ensureAuthenticated, (req, res) => {
	const { _id } = req.user;
	upload(req, res, (error) => {
		if (error) {
			res.render('profilepic', {
				msg: error,
			});
		}
		if (req.file) {
			const profilepic = `/uploads/${req.file.filename}`;

			userUpdater(true, _id, 'updateProfilePic', profilepic);
			res.redirect('/dashboard/profile');
		} else {
			res.render('profilepic', {
				msg: 'Error: No File Selected',
			});
		}
	});
});

module.exports = router;

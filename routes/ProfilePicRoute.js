const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user');

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: (req, file, callback) => {
		callback(
			null,
			file.fieldname + '-' + uuidv4() + path.extname(file.originalname)
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

router.get('/', (req, res) => {
	res.render('profilepic');
});

router.post('/update', (req, res) => {
	const { _id } = req.user;
	upload(req, res, (error) => {
		if (error) {
			res.render('profilepic', {
				msg: error,
			});
		} else {
			if (!req.file) {
				res.render('profilepic', {
					msg: 'Error: No File Selected',
				});
			} else {
				UserModel.findOneAndUpdate(
					{ _id },
					{ profilepic: `uploads/${req.file.filename}` }
				);
				res.redirect('/dashboard/profile');
			}
		}
	});
});

module.exports = router;

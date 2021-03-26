const express = require('express');
const router = express.Router();

// checks if user is logged in and renders dashboard
router.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/dashboard');
	} else {
		res.render('index');
	}
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/dashboard');
	} else {
		res.render('index');
	}
});

module.exports = router;

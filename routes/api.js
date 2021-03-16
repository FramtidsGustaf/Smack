const express = require('express');
const router = express.Router();

router.get('/username', (req, res) => {
	const username = req.user.username;
	res.json(username);
});

module.exports = router;

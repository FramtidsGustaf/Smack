const express = require('express')
const router = express.Router();

router.get('/userform', (req, res) => {
    res.render('userform');
});

router.post('/signup', (req, res) => {
    const UserModel = require('../models/user');
    const user = new UserModel(req.body);

    user.save((error, result) => {
        if (error) {
            return handleError(error);
        }
        res.redirect('/');
    });
});

module.exports = router;
const express = require('express')
const router = express.Router();

router.get('/userform', (req, res) => {
    res.render('userform');
});

router.post('/signup', (req, res) => {
    const { first_name, last_name, user_name, email, password } = req.body;
    let errors = [];

    // check all fields are filled???
    if (!first_name || !last_name || !user_name || !email || !password) {
        errors.push({ msg: 'Enter all fields please' });
    }

    // password must be 6 char long
    if (password.length < 6) {
        errors.push({ msg: 'Password must be 6 character long' })
    }

    // check if errors else register user 
    if (errors.length > 0) {
        res.render('userform', { errors, first_name, last_name, user_name, email })
    } else {
        const UserModel = require('../models/user');
        const user = new UserModel(req.body);

        user.save((error, result) => {
            if (error) {
                return handleError(error);
            }
            res.redirect('/');
        });
    }
});

module.exports = router;
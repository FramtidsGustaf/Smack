const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

router.get('/userform', (req, res) => {
    res.render('userform');
});

router.post('/signup', (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;
    let errors = [];

    // check all fields are filled???
    if (!first_name || !last_name || !username || !email || !password) {
        errors.push({ msg: 'Enter all fields please' });
    }

    // password must be 6 char long
    if (password.length <= 6) {
        errors.push({ msg: 'Password must be atleast 6 character long' });
    }

    // check if errors else register user 
    UserModel.findOne({ email }).exec((error, user) => {
        if (user) {
            errors.push({ msg: 'Email already registerd' })
            res.render('userform', { errors, first_name, last_name, username })
        } else {
            const newUser = new UserModel(req.body);
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) {
                        throw error;
                    }

                    newUser.password = hash;

                    newUser.save((error, result) => {
                        if (error) {
                            return handleError(error);
                        }
                        res.redirect('/', { success: "You are now registred" });
                    });
                })
            });
        }
    });

    if (errors.length > 0) {
        res.render('userform', { errors, first_name, last_name, username, email })
    }
});

module.exports = router;
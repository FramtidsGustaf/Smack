const express = require('express')
const router = express.Router();

router.get('/roomform', (req, res) => {
    res.render('roomform');
});

router.post('/createroom', (req, res) => {
    const RoomModel = require('./models/room');
    const room = new RoomModel(req.body);

    room.save((error, result) => {
        if (error) {
            return handleError(error);
        }
        res.redirect('/');
    });
});


module.exports = router;
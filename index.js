const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.get('/userform', (req, res) => {
  res.render('userform.ejs');
});

app.get('/roomform', (req, res) => {
  res.render('roomform.ejs');
});

app.post('/signup', (req, res) => {
  const UserModel = require('./models/user');
  const user = new UserModel(req.body);

  user.save((error, result) => {
    if (error) {
      return handleError(error);
    }
    res.redirect('/');
  });
});

app.post('/createroom', (req, res) => {
  const RoomModel = require('./models/room');
  const room = new RoomModel(req.body);

  room.save((error, result) => {
    if (error) {
      return handleError(error);
    }
    res.redirect('/');
  });
});



app.listen(port);
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

const mongoose = require('mongoose');
const connection = mongoose.connect('mongodb://localhost:27017/wacksolutions', {useNewUrlParser: true});
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/userform', (req, res) => {
  res.render('userform.ejs');
});

app.post('/signup', (req, res) => {
  const UserModel = require('./models/user');
  const user = new UserModel(req.body);
  console.log(user);
  user.save((error, result) => {
    console.log(result);
    res.redirect('/');
  });
});



db.on('error', (error) => {
	console.log(error);
});

app.listen(port);
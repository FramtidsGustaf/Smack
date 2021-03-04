const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const connection = mongoose.connect('mongodb://localhost:27017/local_library');
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.render('index.ejs');
});

db.on('error', (error) => {
	console.log(error);
});

app.listen(port);
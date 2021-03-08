const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use('/user', require('./routes/UserRoute'))
app.use('/room', require('./routes/RoomRoute'))

app.get('/', (req, res) => {
  res.render('index');
});


app.listen(port, () => { `Server running on ${port}` });
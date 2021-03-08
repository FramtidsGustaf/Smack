const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI

const app = express();
const port = process.env.port || 3000;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(error => console.log(error));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');



app.use('/user', require('./routes/UserRoute'))
app.use('/room', require('./routes/RoomRoute'))

app.get('/', (req, res) => {
  res.render('index');
});


app.listen(port, () => { console.log(`Server running on port ${port}`) });
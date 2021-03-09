const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const userRoute = require('./routes/UserRoute');
const roomRoute = require('./routes/RoomRoute');
const index = require('./routes/index');
const expressEjsLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);

const app = express();
const port = process.env.port || 3000;

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected...'))
	.catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);

app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.use('/user', userRoute);
app.use('/room', roomRoute);
app.use('/', index);


app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

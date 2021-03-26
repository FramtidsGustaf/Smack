const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const expressEjsLayout = require('express-ejs-layouts');
const path = require('path');

//utils
const userUpdater = require('./utils/userUpdater');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

//moment format date
const moment = require('moment');

//setting up server and socket
const app = express();
const port = process.env.port || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//flash
const flash = require('connect-flash');

//session
const session = require('express-session');
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

//passport
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//mongoose and models
const MessageModel = require('./models/message');
const UserModel = require('./models/user');
const RoomModel = require('./models/room');
mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB connected...'))
	.catch((error) => console.log(error));

//ejs
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

//basic settings for app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//flash
app.use(flash());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//the routes
app.use('/dashboard', require('./routes/DashboardRoute'));
app.use('/user', require('./routes/UserRoute'));
app.use('/room', require('./routes/RoomRoute'));
app.use('/', require('./routes/index'));
app.use('/chatroom', require('./routes/ChatRoomRoute'));
app.use('/api', require('./routes/api'));
app.use('/profilepic', require('./routes/ProfilePicRoute'));
app.use('/profile', require('./routes/ProfileRoute'));

// the web socket part
io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		userUpdater(false, user.username, 'isOnline', true);

		socket.join(user.room);

		io.to(user.room).emit('roomUsers');
	});

	socket.on('chatMessage', (message) => {
		const user = getCurrentUser(socket.id);
		const msg = {
			message,
			time: moment().format('YYYY MMMM D, HH:mm'),
			author: user.username,
		};

		io.to(user.room).emit('message', msg);

		UserModel.findOne({ username: user.username }).exec(
			(error, currentUser) => {
				if (error) {
					throw error;
				}
				msg.author = currentUser._id;
				const newMessage = new MessageModel(msg);

				RoomModel.updateOne(
					{ _id: user.room },
					{ $push: { messages: newMessage._id } },
					(error) => {
						if (error) {
							console.log(error);
						}
					}
				);

				newMessage.save((error, result) => {
					if (error) {
						return handleError(error);
					}
				});
			}
		);
	});

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		userUpdater(false, user.username, 'isOnline', false);

		if (user) {
			io.to(user.room).emit('roomUsers');
		}
	});
});

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

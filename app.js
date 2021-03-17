const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const expressEjsLayout = require('express-ejs-layouts');
const path = require('path');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require('./utils/users');

const moment = require('moment');

const MessageModel = require('./models/message');
const UserModel = require('./models/user');
const RoomModel = require('./models/room');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);

const app = express();
const port = process.env.port || 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const userRoute = require('./routes/UserRoute');
const roomRoute = require('./routes/RoomRoute');
const dashboardRoute = require('./routes/DashboardRoute');
const chatRoomRoute = require('./routes/ChatRoomRoute');
const index = require('./routes/index');
const api = require('./routes/api');

// behövde lägga till {useFinfAndModify: false} för att få findOneAndUpdate för att lira 
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log('MongoDB connected...'))
	.catch((error) => console.log(error));


app.set('view engine', 'ejs');
app.use(expressEjsLayout);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

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

app.use('/dashboard', dashboardRoute);
app.use('/user', userRoute);
app.use('/room', roomRoute);
app.use('/', index);
app.use('/chatroom', chatRoomRoute);
app.use('/api', api);

io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		io.to(user.room).emit('roomUsers', {
			users: getRoomUsers(user.room),
		});
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
				//this needs to be fixed urgent!
				RoomModel.findOneAndUpdate(
					{ _id: user.room },
					{ $push: { messages: newMessage._id } },
					(error) => {
						if (error) {
							console.log(error);
						}
					});

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
		const { room, username } = user;

		if (user) {
			io.to(user.room).emit('roomUsers', {
				users: getRoomUsers(user.room),
			});
		}
	});
});

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

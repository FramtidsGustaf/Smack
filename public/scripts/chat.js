document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const room = document.getElementById('room-id').value;
	const username = document.getElementById('username').value;
	const userList = document.getElementById('user-list');
	const chatContainer = document.getElementById('chat-container');
	const messageForm = document.getElementById('message-form');
	const getRoomMembers = document.getElementById('get-room-members');

	const scrollToBottom = () => {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};

	scrollToBottom();

	deleteButton &&
		deleteButton.addEventListener('click', () => {
			fetch(`/chatroom/deleteroom/${room}`, {
				method: 'DELETE',
			}).then((res) => {
				window.location.href = '/dashboard';
			});
		});

	getRoomMembers.addEventListener('click', async () => {
		const _id = getRoomMembers.value;
		const response = await fetch(`/api/roommembers/${_id}`);
		const data = await response.json();
		console.log(data);
	});

	const socket = io();

	socket.emit('joinRoom', { username, room });

	socket.on('message', (message) => {
		const author = document.createElement('span');
		const time = document.createElement('span');
		const messageContent = document.createElement('p');
		const messageContainer = document.createElement('div');

		author.classList.add('p-5');
		messageContent.classList.add(
			'mt-1',
			'bg-danger',
			'p-3',
			'rounded-pill',
			'm-1'
		);

		author.textContent = message.author;
		time.textContent = message.time;
		messageContent.textContent = message.message;

		messageContainer.append(author, time, messageContent);
		chatContainer.appendChild(messageContainer);
		scrollToBottom();
	});

	messageForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const message = e.target.elements.message;

		socket.emit('chatMessage', message.value);

		message.value = '';
		message.focus();
	});

	socket.on('roomUsers', (users) => {
		console.log(users);
		// userList.innerHTML = '';
		// for (user of users.users) {
		// 	const currentUser = document.createElement('p');
		// 	currentUser.textContent = user.username;
		// 	currentUser.classList.add('list-group-item');
		// 	userList.appendChild(currentUser);
		// }
	});
});

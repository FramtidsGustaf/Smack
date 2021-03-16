document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const room = document.getElementById('room-id').value;
	const username = document.getElementById('username').value;
	const userList = document.getElementById('user-list');

	deleteButton &&
		deleteButton.addEventListener('click', () => {
			fetch(`/chatroom/deleteroom/${room}`, {
				method: 'DELETE',
			}).then((res) => {
				window.location.href = '/dashboard';
			});
		});

	const socket = io();

	socket.emit('joinRoom', { username, room });

	socket.on('message', (message) => {
		console.log(message);
	});

	socket.on('roomUsers', (users) => {
		userList.innerHTML = '';
		for (user of users.users) {
			const currentUser = document.createElement('p');
			currentUser.textContent = user.username;
			currentUser.classList.add('list-group-item');
			userList.appendChild(currentUser);
		}
	});
});

document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const room = document.getElementById('room-id').value;
	const username = document.getElementById('username').value;
	const chatContainer = document.getElementById('chat-container');
	const messageForm = document.getElementById('message-form');
	const getRoomMembers = document.getElementById('get-room-members');
	const _id = getRoomMembers.value;
	const userAdminTable = document.getElementById('user-admin-table');
	const roomSettings = document.getElementById('room-settings');
	const saveSettingsButton = document.getElementById('save-settings-button');
	const roomNameInput = document.getElementById('room-name');
	const creator = new Creator();

	const scrollToBottom = () => {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};

	scrollToBottom();

	saveSettingsButton &&
		saveSettingsButton.addEventListener('click', () => {
			const members = userAdminTable.childNodes;
			const admins = [];
			const name = roomNameInput.value;

			for (const member of members) {
				const check = member.childNodes[1].childNodes[0];
				if (check.checked) {
					admins.push(check.value);
				}
			}

			fetch('/chatroom', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					admins,
					_id,
					name,
				}),
			}).then((res) => {
				window.location.href = `/chatroom/${_id}`;
			});
		});

	deleteButton &&
		deleteButton.addEventListener('click', () => {
			if (confirm('Are You Sure?')) {
				fetch(`/chatroom/deleteroom/${room}`, {
					method: 'DELETE',
				}).then((res) => {
					window.location.href = '/dashboard';
				});
			}
		});

	roomSettings &&
		roomSettings.addEventListener('click', () => {
			creator.createUsersAndAdmins();
		});

	getRoomMembers.addEventListener('click', () => {
		creator.createUsersWithStatus();
	});

	const socket = io();

	socket.emit('joinRoom', { username, room });

	socket.on('message', (message) => {
		creator.createNewMessage(message);
		scrollToBottom();
	});

	messageForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const message = e.target.elements.message;

		socket.emit('chatMessage', message.value);

		message.value = '';
		message.focus();
	});

	socket.on('roomUsers', () => {
		creator.createUsersWithStatus();
	});
});

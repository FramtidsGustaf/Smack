const eById = (id) => {
	return document.getElementById(id);
};

const scrollToBottom = (chatContainer) => {
	chatContainer.scrollTop = chatContainer.scrollHeight;
};

document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = eById('delete-button');
	const room = eById('room-id').value;
	const username = eById('username').value;
	const chatContainer = eById('chat-container');
	const messageForm = eById('message-form');
	const getRoomMembers = eById('get-room-members');
	const _id = getRoomMembers.value;
	const userAdminTable = eById('user-admin-table');
	const roomSettings = eById('room-settings');
	const saveSettingsButton = eById('save-settings-button');
	const roomNameInput = eById('room-name');
	const creator = new Creator();

	scrollToBottom(chatContainer);

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
		scrollToBottom(chatContainer);
	});

	messageForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let message = e.target.elements.message;

		if (message.value) {
			socket.emit('chatMessage', message.value);
			message.value = '';
		}
		message.focus();
	});

	socket.on('roomUsers', () => {
		creator.createUsersWithStatus();
	});
});

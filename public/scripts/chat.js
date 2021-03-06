//how lazy of us
const eById = (id) => {
	return document.getElementById(id);
};

//scrolls the chatcontainer to the bottom
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
	const privateCheckbox = eById('private-checkbox');
	const creator = new Creator();

	scrollToBottom(chatContainer);

	//saves new settings to room
	saveSettingsButton &&
		saveSettingsButton.addEventListener('click', () => {
			const members = userAdminTable.childNodes;
			const admins = [];
			const name = roomNameInput.value;
			const isPrivate = privateCheckbox.checked;

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
					isPrivate,
				}),
			}).then(() => {
				window.location.href = `/chatroom/${_id}`;
			});
		});
	//deletes room
	deleteButton &&
		deleteButton.addEventListener('click', () => {
			if (confirm('Are You Sure?')) {
				fetch(`/chatroom/deleteroom/${room}`, {
					method: 'DELETE',
				}).then(() => {
					window.location.href = '/dashboard';
				});
			}
		});

	//gets all data for the settingsmodal
	roomSettings &&
		roomSettings.addEventListener('click', () => {
			creator.createUsersAndAdmins();
		});

	//gets all data for the roomusersmodal
	getRoomMembers.addEventListener('click', () => {
		creator.createUsersWithStatus();
	});

	//socket stars here
	const socket = io();

	//when user joins room
	socket.emit('joinRoom', { username, room });

	// when message is sent from backend
	socket.on('message', (message) => {
		creator.createNewMessage(message);
		scrollToBottom(chatContainer);
	});

	//when user sends message
	messageForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let message = e.target.elements.message;

		if (message.value) {
			socket.emit('chatMessage', message.value);
			message.value = '';
		}
		message.focus();
	});

	//when a new user enters room
	socket.on('roomUsers', () => {
		creator.createUsersWithStatus();
	});
});

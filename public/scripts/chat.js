document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const room = document.getElementById('room-id').value;
	const username = document.getElementById('username').value;
	const chatContainer = document.getElementById('chat-container');
	const messageForm = document.getElementById('message-form');
	const getRoomMembers = document.getElementById('get-room-members');
	const _id = getRoomMembers.value;
	const modalContent = document.getElementById('modal-content');
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

	/*--------------------Potetially oboslete---------------*/
	// const getUsersStatus = async () => {
	// modalContent.innerHTML = '';
	// const _id = getRoomMembers.value;
	// const response = await fetch(`/api/roommembers/${_id}`);
	// let members = await response.json();
	// members = members.users;
	// members.sort((a, b) => {
	// 	return b.isOnline - a.isOnline;
	// });
	// for (member of members) {
	// 	const a = document.createElement('a');
	// 	a.textContent = member.username;
	// 	a.href = `/profile/${member.username}`;
	// 	if (member.isOnline) {
	// 		a.classList.add('text-online', 'd-block');
	// 	} else {
	// 		a.classList.add('text-offline', 'd-block');
	// 	}
	// 	modalContent.append(a);
	// }
	// };

	/*--------------------Potetially oboslete---------------*/
	// const getUsersAndAdmins = async () => {
	// userAdminTable.innerHTML = '';
	// const _id = getRoomMembers.value;
	// const response = await fetch(`/api/roommembers/${_id}`);
	// data = await response.json();
	// const members = data.users;
	// const room = data.room;
	// for (member of members) {
	// 	const tr = document.createElement('tr');
	// 	const username = document.createElement('td');
	// 	const admin = document.createElement('td');
	// 	const label = document.createElement('label');
	// 	const checkadmin = document.createElement('input');
	// 	label.setAttribute('for', member._id);
	// 	label.textContent = member.username;
	// 	checkadmin.type = 'checkbox';
	// 	checkadmin.value = member._id;
	// 	if (room.admins.includes(member._id)) {
	// 		checkadmin.checked = true;
	// 	}
	// 	username.append(label);
	// 	admin.append(checkadmin);
	// 	tr.append(username, admin);
	// 	userAdminTable.append(tr);
	// }
	// };

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

		/*--------------------Potetially oboslete---------------*/
		// const author = document.createElement('span');
		// const time = document.createElement('span');
		// const messageContent = document.createElement('p');
		// const messageContainer = document.createElement('div');

		// author.classList.add('p-5');
		// messageContent.classList.add(
		// 	'mt-1',
		// 	'bg-danger',
		// 	'p-3',
		// 	'rounded-pill',
		// 	'm-1'
		// );

		// author.textContent = message.author;
		// time.textContent = message.time;
		// messageContent.textContent = message.message;

		// messageContainer.append(author, time, messageContent);
		// chatContainer.append(messageContainer);
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

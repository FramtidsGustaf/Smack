document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const room = document.getElementById('room-id').value;
	const username = document.getElementById('username').value;
	const chatContainer = document.getElementById('chat-container');
	const messageForm = document.getElementById('message-form');
	const getRoomMembers = document.getElementById('get-room-members');
	const modalContent = document.getElementById('modal-content');

	const scrollToBottom = () => {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};

	const getUsersStatus = async () => {
		modalContent.innerHTML = '';
		const _id = getRoomMembers.value;
		const response = await fetch(`/api/roommembers/${_id}`);
		const members = await response.json();

		members.sort((a, b) => {
			return b.isOnline - a.isOnline;
		});

		for (member of members) {
			const a = document.createElement('a');
			a.textContent = member.username;
			a.href = `/profile/${member.username}`;
			if (member.isOnline) {
				a.classList.add('text-online', 'd-block');
			} else {
				a.classList.add('text-offline', 'd-block');
			}
			modalContent.append(a);
		}
	};

	scrollToBottom();

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

	getRoomMembers.addEventListener('click', getUsersStatus);

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

	socket.on('roomUsers', () => {
		getUsersStatus();
	});
});

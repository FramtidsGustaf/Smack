class Creator {
	constructor(modalContent, userAdminTable, chatContainer) {
		this._id = this.take('get-room-members').value;
		this.modalContent = this.take('modal-content');
		this.userAdminTable = this.take('user-admin-table');
		this.chatContainer = this.take('chat-container');
	}

	take(id) {
    return document.getElementById(id);
  }

	async fetcher() {
		const response = await fetch(`/api/roommembers/${this._id}`);
		const data = await response.json();
		return data;
	}

	createUsersWithStatus() {
		this.modalContent.innerHTML = '';
		this.fetcher().then((data) => {
			const members = data.users;

			members.sort((a, b) => {
				return b.isOnline - a.isOnline;
			});

			for (const member of members) {
				const a = document.createElement('a');
				a.textContent = member.username;
				a.href = `/profile/${member.username}`;
				if (member.isOnline) {
					a.classList.add('text-online', 'd-block');
				} else {
					a.classList.add('text-offline', 'd-block');
				}
				this.modalContent.append(a);
			}
		});
	}

	createUsersAndAdmins() {
		this.userAdminTable.innerHTML = '';
		this.fetcher().then((data) => {
			const members = data.users;
			const room = data.room;

			for (const member of members) {
				const tr = document.createElement('tr');
				const username = document.createElement('td');
				const admin = document.createElement('td');
				const label = document.createElement('label');
				const checkadmin = document.createElement('input');

				label.setAttribute('for', member._id);
				label.textContent = member.username;

				checkadmin.type = 'checkbox';
				checkadmin.value = member._id;

				if (room.admins.includes(member._id)) {
					checkadmin.checked = true;
				}

				username.append(label);
				admin.append(checkadmin);
				tr.append(username, admin);
				this.userAdminTable.append(tr);
			}
		});
	}

	createNewMessage(message) {
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
		this.chatContainer.append(messageContainer);
	}
}

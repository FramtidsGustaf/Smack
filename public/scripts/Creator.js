class Creator {
	constructor() {
		this._id = this.#take('get-room-members').value;
		this.modalContent = this.#take('modal-content');
		this.userAdminTable = this.#take('user-admin-table');
		this.chatContainer = this.#take('chat-container');
	}

	//laziness drove me to it
	#take(id) {
		return document.getElementById(id);
	}

	#make(whatToMake) {
		return document.createElement(whatToMake);
	}

	//private method that fetches all members in current room
	async #fetcher() {
		const response = await fetch(`/api/roommembers/${this._id}`);
		const data = await response.json();
		return data;
	}

	//takes all members and outputs them in a modal
	//green if they're online red if they're not
	createUsersWithStatus() {
		this.modalContent.innerHTML = '';
		this.#fetcher().then((data) => {
			const members = data.users;

			members.sort((a, b) => {
				return b.isOnline - a.isOnline;
			});

			for (const member of members) {
				const a = this.#make('a');
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

	//creates the content of the settings modal that's only visible for the admins
	createUsersAndAdmins() {
		this.userAdminTable.innerHTML = '';
		this.#fetcher().then((data) => {
			const members = data.users;
			const room = data.room;

			for (const member of members) {
				const tr = this.#make('tr');
				const username = this.#make('td');
				const admin = this.#make('td');
				const label = this.#make('label');
				const checkadmin = this.#make('input');

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

	//building the message and outputs it
	createNewMessage(message) {
		const author = this.#make('span');
		const time = this.#make('span');
		const messageContent = this.#make('p');
		const messageContainer = this.#make('div');

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

document.addEventListener('DOMContentLoaded', (e) => {
    const privateSwitch = document.getElementById('private-switch');
    const privateLabel = document.getElementById('private-label');
    const userList = document.getElementById('user-list');
    const submitButton = document.getElementById('submit-button');
    const roomName = document.getElementById('room-name');
    let isFetched = false;
    let users;

    privateSwitch.addEventListener('click', async (e) => {
        let label = 'Public Room';
        if (privateSwitch.checked) {
            if (!isFetched) {
                const response = await fetch('/api/allbutme');
                users = await response.json();
                isFetched = true;
            }
            label = 'Private Room';
            if (users) {
                for (user of users) {
                    const div = document.createElement('div');
                    const input = document.createElement('input');
                    const label = document.createElement('label');
                    div.classList.add('custom-control', 'custom-checkbox');
                    input.type = 'checkbox';
                    input.classList.add('custom-control-input');
                    input.id = user._id;
                    input.value = user._id;
                    label.classList.add('custom-control-label');
                    label.setAttribute("for", user._id);
                    label.textContent = user.username;
                    div.append(input, label);
                    userList.append(div);
                }
            }
        } else {
            userList.innerHTML = '';
        }
        privateLabel.textContent = label;
    });

    submitButton.addEventListener('click', e => {
        e.preventDefault();
        const includedUsers = [];
        if (privateSwitch.checked) {
            const userArray = userList.childNodes;
            for (user of userArray) {
                const checkbox = user.childNodes[0];
                if (checkbox.checked) {
                    includedUsers.push(checkbox.value);
                }
            }
        }
        fetch('/room/createroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                includedUsers,
                name: roomName.value || 'No name room',
                isPrivate: privateSwitch.checked,
            })
        })
            .then(res => {
                window.location.href = '/dashboard';
            })
    });




});
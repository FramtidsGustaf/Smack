document.addEventListener('DOMContentLoaded', (e) => {
    const privateSwitch = document.getElementById('private-switch');
    const privateLabel = document.getElementById('private-label');
    const userList = document.getElementById('user-list');
    let isFetched = false;
    let users;

    privateSwitch.addEventListener('click', async (e) => {
        let label = 'Public Room';
        if (privateSwitch.checked) {
            if (!isFetched) {
                const response = await fetch('/api/allusers');
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
                    label.classList.add('custom-control-label');
                    label.setAttribute("for", user._id);
                    label.textContent = user.username;
                    div.append(input, label);
                    userList.append(div);
                }
            }
            console.log(users);
        } else {
            userList.innerHTML = '';
        }
        privateLabel.textContent = label;
    });




});
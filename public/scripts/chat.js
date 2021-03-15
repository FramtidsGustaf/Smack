document.addEventListener('DOMContentLoaded', (e) => {
	console.log(window.location.href);
	const deleteButton = document.getElementById('delete-button');
	const roomId = deleteButton.value;
	deleteButton.addEventListener('click', () => {
		fetch(`/chatroom/deleteroom/${roomId}`, {
			method: 'DELETE',
		}).then((res) => {
			window.location.href = '/dashboard';
		});
	});
});

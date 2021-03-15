document.addEventListener('DOMContentLoaded', (e) => {
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

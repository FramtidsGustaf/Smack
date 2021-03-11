document.addEventListener('DOMContentLoaded', (e) => {
	const deleteButton = document.getElementById('delete-button');
	const userId = document.getElementById('user-id').value;
	const roomId = deleteButton.value;
	deleteButton.addEventListener('click', () => {
		fetch(`/chatroom/deleteroom/${roomId}/${userId}`, {
			method: 'DELETE',
		})
			.then((res) => {
        window.location.href ='/dashboard';
      });
	});
});

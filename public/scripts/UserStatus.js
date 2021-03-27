// user is set to offline when window is closed
class UserStatus {
	static offline() {
		window.addEventListener('beforeunload', () => {
				fetch('/api/closingwindow', {
					method: 'POST',
				});
		});
	}
}

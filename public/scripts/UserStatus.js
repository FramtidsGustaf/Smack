class UserStatus {
	static offline() {
		window.addEventListener('beforeunload', () => {
				fetch('/api/closingwindow', {
					method: 'POST',
				});
		});
	}
}

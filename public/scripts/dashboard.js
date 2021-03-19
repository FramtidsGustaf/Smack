document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('beforeunload', () => {
		fetch('/api/closingwindow', {
			method: 'POST',
		});
	});
	const setOnline = () => {
		fetch('/api/settoonline', {
			method: 'POST',
		});
	};

	setOnline();
});

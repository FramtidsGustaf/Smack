document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('beforeunload', () => {
		fetch('/api/closingwindow', {
			method: 'POST',
		});
	});
});

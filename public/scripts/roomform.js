document.addEventListener('DOMContentLoaded', (e) => {
    const privateSwitch = document.getElementById('private-switch');
    const privateLabel = document.getElementById('private-label');



    privateSwitch.addEventListener('click', e => {
        const label = privateSwitch.checked ? "Private Room" : "Public Room";
        privateLabel.textContent = label;
    });
});
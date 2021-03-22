const UserModel = require('../models/user');

const userUpdater = (is_id, idOrName, action, setTo, res) => {
	const query = is_id ? { _id: idOrName } : { username: idOrName };

	const whatToDo = {
		isOnline: (setTo) => {
			return { isOnline: setTo };
		},
		updateProfilePic: (setTo) => {
			return { profilepic: setTo };
		},
	};

	UserModel.updateOne(query, whatToDo[action](setTo), (error) => {
		if (error) {
			console.log(error);
			if (res) {
				res.status(400);
			}
		}
	});
	if (res) {
		res.status(200);
	}
};

module.exports = userUpdater;

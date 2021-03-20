const UserModel = require('../models/user');

const updateUserStatus = (is_id, idOrName, setTo, res) => {
	const query = is_id ? { _id: idOrName } : { username: idOrName };

	UserModel.updateOne(query, { isOnline: setTo }, (error) => {
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

module.exports = updateUserStatus;

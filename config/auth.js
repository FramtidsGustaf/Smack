const auth = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Please login to view this resource');
		res.redirect('/user/signin');
	},
};

module.exports = auth;

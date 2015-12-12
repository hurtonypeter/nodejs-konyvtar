var requireOption = require('../common').requireOption;

exports.index = function (objectrepo) {
	//megjeleníti a felhasználók listáját

	var User = requireOption(objectrepo, 'User');

	return function (req, res, next) {
		// betölti a felhasználók listáját
		/*var user = new User({
			cardNumber: 1234567890,
			name: "Kuka Kázmér",
			birthDate: new Date(),
			birthPlace: "Baja",
			address: "6528 Bátmonostor, Kalauz utca 23.",
			mothersName: "Kukáné Katalin"
		});user.save();*/
		
		User.find(function (err, users) {
			if(err) return next(err);
			
			res.render('users/index', {
				users: users
			});	
		});
		
	};	
};

 

exports.load = function (objectrepo) {
	// betölt egy felhasználót és a kölcsönzéseit 

	var User = requireOption(objectrepo, 'User');

	return function (req, res, next, id) {
		
		User.load(id, function (err, user) {
			if (err) return next(err);
			if (!user) return next(new Error('User not found.'));
			
			req.user = user;
			next();
		});
	};
};

exports.show = function (objectrepo) {
	// megjeleníti a lekérdezett felhasználót

	return function (req, res, next) {
		res.render('users/details', {
			user: req.user
		});
	};
};
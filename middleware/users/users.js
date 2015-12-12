var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
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

exports.load = function (req, res, next, id) {
	// betölt egy felhasználót és a kölcsönzéseit 
	
	User.load(id, function (err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('User not found.'));
		
		req.user = user;
		next();
	});
}

exports.show = function (req, res, next) {
	// megjeleníti a lekérdezett felhasználót
	res.render('users/details', {
		user: req.user
	});
}
var mongoose = require('mongoose');
var Rent = mongoose.model('Rent');
var BookItem = mongoose.model('BookItem');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	// megjeleníti a kölcsönzö/visszahozó oldalt
	
	res.render('rents/index', {});
};

exports.rentBook = function (req, res, next) {
	//megkap egy könyvpéldány azonosítót és egy felhasználó könyvtári számát
	// majd ennek a felhasználónak kikölcsönzi a könyvet
	
	BookItem.loadByBarcode(req.body.bookBarcode, function (err, bookItem) {
		if (err) return next(err);
		if (!bookItem) return next(new Error("BookItem not found."));
		
		if(bookItem.state != "SZABAD") return next(new Error("This BookItem is not free currently."));
		
		User.loadByBarcode(req.body.userBarcode, function (err, user) {
			if (err) return next(err);
			if (!user) return next(new Error("User not found."));
			
			var rent = new Rent({ 
				bookItem: bookItem.id,  
				user: user.id
			});
			
			rent.save(function (err) {
				if (!err) {
					user.rents.push(rent);
					user.save();
					
					bookItem.rents.push(rent);
					bookItem.save();
					
					return res.redirect('/books/items/details/' + bookItem.id);
				}
				
				res.render('rents/index', {});
			});
		});
		
	});
};

exports.returnBook = function (req, res, next) {
	//megkap egy könyvpéldány azonosítót, és visszahozottnak nyilvánítja a példányt
	
	BookItem.loadByBarcode(req.body.bookBarcode, function (err, bookItem) {
		if (err) return next(err);
		if (!bookItem) return next(new Error("BookItem not found."));
		
		var lastRent = null;
		bookItem.rents.forEach(function (rent) {
			if (lastRent == null) {
				lastRent = rent;
				return;
			}
			
			if (lastRent.start < rent.start) {
				lastRent = rent;
			}
		});
		
		lastRent.returnDate = new Date();
		lastRent.save(function (err) {
			if (!err) {
				return res.redirect('/books/items/details/' + bookItem.id);
			}
			
			res.render('rents/index', {});
		});
	});
};
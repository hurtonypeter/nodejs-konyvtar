var mongoose = require('mongoose');
var BookItem = mongoose.model('BookItem');
var extend = require('util')._extend;

exports.load = function (req, res, next, itemId) {
	//megkapja a betöltendő könyvpéldány azonosítóját, 
	//létrehozza a model és felpakolja a requestre

	BookItem.load(itemId, function (err, bookItem) {
		if (err) return next(err);
		if (!bookItem) return next(new Error("BookItem not found."));
		
		req.bookItem = bookItem;
		next();
	});
	
};

exports.loadItemConditions = function (req, res, next) {
	//felrakja a req-re a könyvpéldányok condition enumjának lehetséges értékeit
	
	req.bookItemConditionValues = BookItem.schema.path('condition').enumValues;
	
	next();
}

exports.details = function (req, res, next) {
	//megjeleníti a könyvpéldány részletes oldalát
	
	res.render('books/itemDetails', {
		bookItem: req.bookItem
	});
}

exports.new = function (req, res, next) {
	//megjeleníti a formot a könyvpéldány létrehozásához
	
	res.render('books/itemEdit', {
		bookItem: new BookItem(),
		book: req.book,
		conditionValues: req.bookItemConditionValues
	});
}

exports.create = function (req, res, next) {
	//elmenti a könyvpéldányt
	var bookItem = new BookItem(req.body);
	bookItem.book = req.book;
	
	bookItem.save(function (err) {
		if (!err) {
			req.book.items.push(bookItem);
			req.book.save();
			
			return res.redirect('/books/details/' + bookItem.book._id);
		}
		
		res.render('books/itemEdit', {
			bookItem: bookItem,
			conditionValues: req.bookItemConditionValues
		});
	});
}

exports.edit = function (req, res, next) {
	//megjeleníti a könyvpéldányt szerkesztéshez
	
	res.render('books/itemEdit', {
		bookItem: req.bookItem,
		conditionValues: req.bookItemConditionValues
	});
}

exports.update = function (req, res, next) {
	//elmenti a könyvpéldány módosításait
	
	var bookItem = req.bookItem;
	bookItem = extend(bookItem, req.body);
	bookItem.save(function (err) {
		if (!err) return res.redirect('/books/details/' + bookItem.book._id);
		
		res.render('books/itemEdit', {
			bookItem: bookItem,
			conditionValues: req.bookItemConditionValues
		});
	});
	
}

exports.delete = function (req, res, next) {
	//megjeleníti a könyvpéldány törlése formot
	
	res.render('books/itemDelete', {
		bookItem: req.bookItem
	});
}

exports.destroy = function (req, res, next) {
	//kitörli a könyvpéldányt
	
	var bookItem = req.bookItem;
	bookItem.remove(function (err) {
		res.redirect("/books/details/" + bookItem.book._id);
	});
	
}
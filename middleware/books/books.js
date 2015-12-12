var extend = require('util')._extend;
var requireOption = require('../common').requireOption;

exports.load = function (objectrepo) {
	//megkapja a betöltendő könyv azonosítóját, 
	//létrehozza a modelt és betölti az entitást
	
	var Book = requireOption(objectrepo, 'Book');
	
	return function (req, res, next, id) {
		
		Book.load(id, function (err, book) {
			if (err) return next(err);
			if (!book) return next(new Error('Book not found.'));
			
			req.book = book;
			next();
		});
	};
	
};

exports.index = function (objectrepo) {
	// listázza a könyveket
	
	var Book = requireOption(objectrepo, 'Book');
	
	return function (req, res, next) {
		
		Book.list(function (err, books) {
			if (err) return next(err);
			
			res.render('books/index', {
				books: books
			});
		});
	};
	
};

exports.edit = function (objectrepo) {
	//megjeleníti a könyv szerkesztő oldalát
	
	return function (req, res, next) {
		
		res.render('books/edit', {
			book: req.book
		});
	};
};

exports.update = function (objectrepo) {
	//szerkeszti a köynvet
	
	return function (req, res, next) {
		
		var book = req.book;
		book = extend(book, req.body);
		book.save(function (err) {
			if(!err) return res.redirect('/books/details/' + book._id);
			
			res.render('book/edit', {
				book: book
			});
		});
		
	};
}

exports.new = function (objectrepo) {
	//rendereli az új könyv létrehozó oldalát
	
	var Book = requireOption(objectrepo, 'Book');
	
	return function (req, res, next) {
		res.render('books/edit', {
			book: new Book()
		});	
	};
}

exports.create = function (objectrepo) {
	//létrehoz egy új könyvet
	
	var Book = requireOption(objectrepo, 'Book');

	return function (req, res, next) {
		var book = new Book(req.body);
		
		book.save(function (err) {
			if (!err)  {
				return res.redirect('/books/details/' + book._id);
			};
			
			res.render('books/edit', {
				book: book
			});
		});
	};
};

exports.show = function (objectrepo) {
	// renderel egy könyv oldalt
	
	return function (req, res, next) {
		res.render('books/details', {
			book: req.book
		});
	};
};

 
var expect = require('chai').expect;
var booksMW = require('../middleware/books/books.js');

describe('books middleware tests', function	() {
	
	//middleware load függvényének tesztjei
	describe('testing book loading', function () {
		
		it('should load a book', function (done) {
		
			var req = {};
			var res = {};
			var fakeBook = {
				
			};
			var fakeBookModel = {
				load: function (id, cb) {
					cb(undefined, fakeBook);
				}
			};
			
			booksMW.load({ 
				Book: fakeBookModel 
			})(req, res, function (err) {
				expect(err).to.eql(undefined);
				expect(req.book).to.eql(fakeBook);
				done();
			});
			
		});
		
		it('book should not exist', function (done) {
		
			var fakeBookModel = {
				load: function (id, cb) {
					cb(undefined, null);
				}
			};
			
			booksMW.load({ 
				Book: fakeBookModel 
			})({}, {}, function (err) {
				expect(err).to.be.an.instanceof(Error);
				expect(err).to.have.property('message', 'Book not found.');
				done();
			});
			
		});
		
		it('should drop db error', function (done) {
			
			var fakeBookModel = {
				load: function (id, cb) {
					cb('hiba', undefined);
				}
			};
			
			booksMW.load({ 
				Book: fakeBookModel 
			})({}, {}, function (err) {
				expect(err).to.eql('hiba');
				done();
			});
			
		});
		
	});
	
	//mw index függvényének tesztelése
	//ez sajnos nem működik, mert a response.render, response.redirect
	//	függvényeket nem sikerült mockolni. Amikor ezek vannak hívva,
	//	nincs meghívva a next a mw-ben, ezért a mocha elszáll timeout-tal
	/*describe('testing index function', function () {
		
		it('should render the book list', function (done) {
			
			var res = {
				render: function (view, model) {
					console.log(view);
					console.log(model);
					res.tpl = model;
				}
			};
			var books = [{}, {}];
			var fakeBookModel = {
				list: function (cb) {
					cb(undefined, books);
				}
			};
			
			booksMW.index({
				Book: fakeBookModel
			})({}, res, function (err) {
				//expect(res.tpl.books).to.eql(books);
				done();
			});
			
		});
		
	});*/
	
	
});
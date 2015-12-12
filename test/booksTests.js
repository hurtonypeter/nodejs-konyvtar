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
	describe('testing index function', function () {
		
		
		
	});
	
	
});
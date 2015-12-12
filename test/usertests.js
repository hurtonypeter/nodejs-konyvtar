var expect = require('chai').expect;
var usersMW = require('../middleware/users/users.js');

describe('users middleware tests', function () {
	
	//middleware load függvényének tesztjei
	describe('testing user loading', function () {
		
		it('should load a user', function (done) {
		
			var req = {};
			var res = {};
			var fakeUser = {
				
			};
			var fakeUserModel = {
				load: function (id, cb) {
					cb(undefined, fakeUser);
				}
			};
			
			usersMW.load({ 
				User: fakeUserModel 
			})(req, res, function (err) {
				expect(err).to.eql(undefined);
				expect(req.user).to.eql(fakeUser);
				done();
			});
			
		});
		
		it('book should not exist', function (done) {
		
			var fakeUserModel = {
				load: function (id, cb) {
					cb(undefined, null);
				}
			};
			
			usersMW.load({ 
				User: fakeUserModel 
			})({}, {}, function (err) {
				expect(err).to.be.an.instanceof(Error);
				expect(err).to.have.property('message', 'User not found.');
				done();
			});
			
		});
		
		it('should drop db error', function (done) {
			
			var fakeUserModel = {
				load: function (id, cb) {
					cb('hiba', undefined);
				}
			};
			
			usersMW.load({ 
				User: fakeUserModel 
			})({}, {}, function (err) {
				expect(err).to.eql('hiba');
				done();
			});
			
		});
		
	});
	
});
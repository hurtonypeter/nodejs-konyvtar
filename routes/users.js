var express = require('express');
var router = express.Router();

var users = require('../middleware/users/users.js');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var objectrepo = {
	User: User	
};

router.param('id', users.load(objectrepo));
router.get('/', users.index(objectrepo));
router.get('/details/:id', users.show(objectrepo));

module.exports = router;

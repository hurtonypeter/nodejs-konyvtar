var express = require('express');
var router = express.Router();

var books = require('../middleware/books/books.js');
var bookitems = require('../middleware/books/bookitems.js');

var mongoose = require('mongoose');
var Book = mongoose.model('Book');

var objectrepo = {
	Book: Book	
};

router.param('id', books.load(objectrepo));
router.get('/', books.index(objectrepo));
router.get('/details/:id', books.show(objectrepo));
router.get('/new', books.new(objectrepo));
router.post('/new', books.create(objectrepo));
router.get('/edit/:id', books.edit(objectrepo));
router.post('/edit/:id', books.update(objectrepo));

router.param('itemId', bookitems.load);
router.get('/items/details/:itemId', bookitems.details);
router.get('/items/add/:id', bookitems.loadItemConditions, bookitems.new);
router.post('/items/add/:id', bookitems.loadItemConditions, bookitems.create);
router.get('/items/edit/:itemId', bookitems.loadItemConditions, bookitems.edit);
router.post('/items/edit/:itemId', bookitems.loadItemConditions, bookitems.update);
router.get('/items/delete/:itemId', bookitems.delete);
router.post('/items/delete/:itemId', bookitems.destroy);

module.exports = router;

var express = require('express');
var router = express.Router();

var rents = require('../middleware/rents/rents.js');

router.get('/', rents.index);
router.post('/rent', rents.rentBook);
router.post('/return', rents.returnBook);

module.exports = router;

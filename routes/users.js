var express = require('express');
var router = express.Router();

var users = require('../middleware/users/users.js');

router.param('id', users.load);
router.get('/', users.index);
router.get('/details/:id', users.show);

module.exports = router;

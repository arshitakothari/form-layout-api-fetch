var express = require('express');
var router = express.Router();
var userController = require('../controller/usercontroller');

/* GET home page. */
router.post('/register', userController.register);

module.exports = router;

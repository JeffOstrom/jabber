var path = require("path");
var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req, res) {
	console.log(res.locals.user.id);
	res.render('dashboard');
});

module.exports = router;
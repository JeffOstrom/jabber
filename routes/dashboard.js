var path = require("path");
var express = require('express');
var router = express.Router();

var models = require("./models");

/*Retrieve All Global Messages*/
router.get('/dashboard/', function(req, res) {
	models.Messages.findAll()
});

// /*Retrieve User's Messages*/
// router.get('/dashboard/:userID', function(req, res) {
// 	models.Messages.findAll({
// 	where: {
// 		userID: req.params.name //name in HTML
// 	}
// })
//    	res.render('dashboard');
// });

module.exports = router;
var path = require("path");
var express = require('express');
var router = express.Router();
var models = require("../models");

<<<<<<< HEAD
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
=======
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.render('index');
    }
}

router.get('/dashboard', ensureAuthenticated, function(req, res) {
    res.render('dashboard');
});

/*Post Message*/
router.post('/dashboard', function(req, res) {

	console.log("locals F: " + res.locals.user.firstname);


	/*Creating new message*/
	var newMessage = {
		user: res.locals.user.firstname + " " + res.locals.user.lastname,
		message: req.body.message
	};

	/*Post new message*/
	models.Messages.create(newMessage).then(function(message){
		req.flash('success_msg', 'Message successfully sent');
		res.redirect('/dashboard');
	});

});


>>>>>>> master

module.exports = router;
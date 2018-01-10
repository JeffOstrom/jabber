var path = require("path");
var express = require('express');
var router = express.Router();
var models = require("../models");

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



module.exports = router;
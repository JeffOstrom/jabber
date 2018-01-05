var express 		= require('express');
var router 			= express.Router();
var bcrypt 			= require('bcryptjs');
var passport 		= require('passport'), 
var LocalStrategy 	= require('passport-local').Strategy;
var db				= require("../models")
var User 			= require("..models/accounts")
//Register User
router.get('/signup'/*/registration*/, function(req, res, next) {

});

router.post('/signup'/*/registration*/, function(req, res, next) {
	
	var firstName 	= req.body.username;
	var	lastname    = req.body.lastname;
	var	email		= req.body.email;
	var	password 	= req.body.password;
	//Confirm Password
	var password2	= req.body.password2;

	//Validating field forms
	req.checkBody('firstname', 	'Name is required').notEmpty();
	req.checkBody('lastname',	'Name is required').notEmpty();
	req.checkBody('email', 		'Email is required').isEmail();
	req.checkBody('password', 	'Password is required').notEmpty();
	req.checkBody('password2', 	'Password does not match').equals(req.body.password);

	var errors		= req.validationErrors()
	if (errors) {
		res.render('signup')
	} else {
		var newUser = new user({
			//New user information goes here and gets render 
		})
	};
});

passport.use(new LocalStrategy (
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { 
				return done(err); 
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

module.exports		= router;
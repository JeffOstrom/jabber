var express 		= require('express');
var router 			= express.Router();
var bcrypt 			= require('bcryptjs');
var passport 		= require('passport'), 
var LocalStrategy 	= require('passport-local').Strategy;
var db				= require("../models")

var User 			= require("..models/accounts")

passport.serializeUser(function(user, done) {
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 	User.findById(id, function(err, user) {
    	done(err, user);
  	});
});

//Register User
router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.post('/signup', function(req, res, next) {
	
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
	req.checkBody('cpassword', 	'Password does not match').equals(req.body.password);
	req.checkBody('bio', 		'Please tell us something about yourself').notEmpty();
	

	var errors		= req.validationErrors()
	if (errors) {
		res.render('signup')
	} 
});

passport.use('local.signup', new LocalStrategy ({
	usernameField: 'email',
	usernameField: 'email',
	passReqToCallback: true
},	function(req, username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { 
				return done(err); 
			}

			if(user) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Incorrect username.' });
			}

			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			/*Creates new instance*/
			var newUser 		= new User();
			newUser.firstname	= req.body.firstname;
			newUser.lastname	= req.body.lastname;
			newUser.email		= req.body.email;
			newUser.password 	= req.body.password;

			newUser.save(function(err){
				if(err) {
					return done(err);
				} 

				return done(null, newUser);
			});
		});
	};
));

module.exports		= router;
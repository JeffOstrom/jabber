var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require("../models/accounts");

passport.serializeUser(function(user, done) {
  	done(null, user);
});

passport.deserializeUser(function(id, done) {
 	User.findById(id, function(err, user) {
    	done(err, user);
  	});
});

router.get('/signup', function(req, res){
	res.render('signup');
});

//Register User
router.post('/signup', function(req, res, next) {
	
	var firstname = req.body.firstname;
	var	lastname = req.body.lastname;
	var	email = req.body.email;
	var	password = req.body.password;
	var cpassword = req.body.cpassword;
	var bio	= req.body.bio;
	// var profilepic = req.body.profilepic;

	console.log(firstname + " " + lastname + " " + email + " " + password + " " + bio);
	var newUser = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: password,
		bio: bio
	};

	//Validating field forms
	req.checkBody('firstname', 'Firstname is required').notEmpty();
	req.checkBody('lastname', 'Lastname is required').notEmpty();
	req.checkBody('email', 'Email is required').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cpassword', 'Password does not match').equals(req.body.password);
	req.checkBody('bio', 'Please tell us something about yourself').notEmpty();
	// req.checkBody('profilepic', 'Please upload a profile picture').notEmpty();

	var errors = req.validationErrors();
    if(errors){
        res.render('signup', {
            errors : errors
        });
    }
    else{
    	db.User.create(newUser).then(function() {
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/signin');
		});
    }
});

/*Login*/
router.post('/signin', 
  	passport.authenticate('local', { failureRedirect: '/signin' }),
  	function(req, res) {
    	res.redirect('/dashboard');
  	}
);

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
				req.flash('msgError', 'User Already Exists')
				return done(null, false);
			} 

			if(!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			/*Creates new instance of user*/
			var newUser = new User();
			newUser.firstname = req.body.firstname;
			newUser.lastname = req.body.lastname;
			newUser.email = req.body.email;
			newUser.password = req.body.password;
			newUser.bio	= req.body.bio;
			newUser.profilepic = req.body.profilepic;

			newUser.save(function(err){
				if(err) {
					return done(err);
				} 

				return done(null, newUser);
			});
		});
	}
));

module.exports = router;


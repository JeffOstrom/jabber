var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require("../models");
var User = require("../models/accounts");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Register */
router.get('/signup', function(req, res){
    res.render('signup');
});

/* Register */
router.post('/signup', function(req, res){

    var firstname = req.body.firstname;
	var	lastname = req.body.lastname;
	var	email = req.body.email;
	var	password = req.body.password;
	var cpassword = req.body.cpassword;
	var bio	= req.body.bio;
	var profilepic = req.body.profilepic;

    //Validating field forms
	req.checkBody('firstname', 	'Name is required').notEmpty();
	req.checkBody('lastname',	'Name is required').notEmpty();
	req.checkBody('email', 		'Email is required').isEmail();
	req.checkBody('password', 	'Password is required').notEmpty();
	req.checkBody('cpassword', 	'Password does not match').equals(req.body.password);
	req.checkBody('bio', 		'Please tell us something about yourself').notEmpty();
	req.checkBody('profilepic', 'Please upload a profile picture').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.render('signup', {
            errors : errors
        })
    } else	{

    	/*Creating new user*/
        var newUser = new User();
			newUser.firstname = req.body.firstname;
			newUser.lastname = req.body.lastname;
			newUser.email = req.body.email;
			newUser.password = req.body.password;
			newUser.bio	= req.body.bio;
			newUser.profilepic = req.body.profilepic;

		/*Hiding the user's password in the database*/
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                db.User.create(newUser).then(function(req, res, user){
                    req.flash('success_msg', 'You are registered and can now login');
		            res.redirect('/signin');
                });
            });
        });
    };
});

passport.use('local.signup', new LocalStrategy(
    function(username, password, done) {
    db.User.findOne({
        where: {
            name: username
          }
    }).then(function(user){
        if(user == null || user.name !== username){
            return done(null, false, {message: 'Unknown User'});
        } else {
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    db.User.findOne({
        where: {
            id: id
         }
    }).then(function(user){
        done(null, user);
    });
});

module.exports = router;


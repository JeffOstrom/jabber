var express 		= require('express');
var router 			= express.Router();
var bcrypt 			= require('bcryptjs');
var passport 		= require('passport'), 
var LocalStrategy 	= require('passport-local').Strategy;
var db				= require("../models")

router.get('/signup', function(req, res, next) {

});

router.post('/signup', function(req, res, next) {
	{
		firstName: req.body.username,
		lastName: req.body.lastname,
		email: req.body.email,
		passWord: req.body.password,
	}
});

// passport.use( new LocalStrategy (
// 	function(username, password, done) {
// 		User.findOne({ username: username }, function(err, user) {
// 			if (err) { 
// 				return done(err); 
// 			}
// 			if (!user) {
// 				return done(null, false, { message: 'Incorrect username.' });
// 			}

// 			if (!user.validPassword(password)) {
// 				return done(null, false, { message: 'Incorrect password.' });
// 			}
// 			return done(null, user);
// 		});
// 	}
// ));

module.exports		= router;
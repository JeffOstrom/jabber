
var path = require("path");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/signin', function(req, res) {
    res.render('signin');
});

/*Sign in*/
router.post('/signin', 
  	passport.authenticate('local', { failureRedirect: '/signin' }),
  	function(req, res) {
    	res.redirect('/dashboard');
  	}
);

/*Sign out*/
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/signin');
});

module.exports = router;
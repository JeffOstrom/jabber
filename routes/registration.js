var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require("../models");

/* Register */
router.get('/signup', function(req, res) {
    res.render('signup');
});

//Register User
router.post('/signup', function(req, res, next) {
	
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var bio	= req.body.bio;
  
	var newUser = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: password,
		bio: bio
	};

	//Validating field forms
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cpassword', 'Password does not match').equals(req.body.password);
	req.checkBody('bio', 'Please tell us something about yourself').notEmpty();
	// req.checkBody('profilepic', 'Please upload a profile picture').notEmpty();

	var errors = req.validationErrors();
    if(errors){
        res.render('signup', {
            errors: errors
        })
    } else {
    	db.User.findOne({
	       where: {
	           email: email
	       }
	   }).then(function(user){
	        if(user === null){
            
	        	/*Creating new user*/
		      var newUser = {
					firstname: firstname,
					lastname: lastname,
					email: email,
					password: password
					// bio: bio,
					// profilepic: profilepic
				};

				/*Hiding the user's password in the database*/
		      bcrypt.genSalt(10, function(err, salt) {
		          bcrypt.hash(newUser.password, salt, function(err, hash) {
		              newUser.password = hash;
		              db.User.create(newUser).then(function(user){
		                  req.flash('success_msg', 'You are registered and can now login');
		                  console.log("You are registered and can now login")
				            res.redirect('/signin');
		              });
		          });
		      });
	    	} else {
                req.flash('error_msg', 'Email already registered with us');
                res.redirect('/signup');
            }
		});	
    };
});

passport.use(new LocalStrategy(
    function(email, password, done) {
	     db.User.findOne({
	          where: {
	              email: email
	          }
	    }).then(function(user, err){
	    	if(err) {
	    		return done(err);
	    	}

	      if(user === null){
	          return done(null, false, {error: 'Unknown User'});
	      } else {
	          bcrypt.compare(password, user.password, function(err, isMatch){
	              if(isMatch){
	                  return done(null, user);
	              } else {
	                  return done(null, false, {error: 'Invalid Password'});
	              };
	          });
	      }
	   });
	 }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    db.User.findOne({
        where: {
            id: id.email
         }
    }).then(function(user){
        done(null, user);
    });
});

/*Sign in*/
router.post('/signin', 
  	passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect: '/signin', failureFlash: true}),
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


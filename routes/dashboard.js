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
};

router.get('/dashboard', ensureAuthenticated, function(req, res) {
    if(res.locals.user){
        var id = res.locals.user.id;
        models.Messages.findAll({
            where: {
                user: id
            },
            order: [
                ['id', 'DESC']
            ]
        }).then(function(result){
            if(result !== undefined){
                var messages = [];
                for(var i = 0; i < result.length; i++){
                    messages.push(result[i].dataValues);
                }
                res.render('dashboard', { messages: messages});
            }
            else{
                res.render('dashboard');
            }
        });
    }
    else {
        res.render('index');
    }
});

/* Post Message */
router.post('/dashboard', function(req, res) {

	console.log("locals F: " + res.locals.user.firstname);

	/* Creating new message */
	var newMessage = {
		// user: res.locals.user.firstname + " " + res.locals.user.lastname,
		user: res.locals.user.id,
		message: req.body.message,
		image: req.body.messageImage
	};

	/* Post new message */
	models.Messages.create(newMessage).then(function(message){
		req.flash('success_msg', 'Message successfully sent');
		res.redirect('/dashboard');
	});

});

router.get('/dashboard/search', ensureAuthenticated, function(req, res) {

   var result = req.body.search;

   req.checkBody('result').notEmpty();

   console.log(result);

   res.render('search');

});

router.post('/dashboard/search', ensureAuthenticated, function(req, res) {

   var result = req.body.search;

   req.checkBody('result').notEmpty();

   console.log(result);

   res.render('search');

});
module.exports = router;
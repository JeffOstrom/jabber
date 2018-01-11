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
                    result[i].dataValues.firstname = res.locals.user.firstname;
                    result[i].dataValues.image = res.locals.user.profilepicture;
                    messages.push(result[i].dataValues);
                }
                
                console.log(messages);
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

router.post('/update/:id', function(req, res){
    var id = req.params.id;
    var updatedMessage = req.body.message;
    var date = new Date();
    models.Messages.update({
        message: updatedMessage,
        updatedAt: date
    },
    {
        where: {
            id: id
        }
    }).then(function(todos) {
        res.send('success');
    });
});

router.post('/dashboard/search', function(req, res) {
    // data item
    //sequelize 
    console.log(req.body)

    models.User.findAll({
    where: {
        firstname: ''//req.params.results// req.body.searchItem
        // [Op.or]: [{firstname: "something"}, {lastname: "email@email.com"}]
        }
    }).then(function(results){
        console.log(results);
        // res.json(results);
    });
});

module.exports = router;
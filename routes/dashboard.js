var path = require("path");
var express = require('express');
var router = express.Router();
var models = require("../models");
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'public/assets/images/post' });

/* To make sure user session */
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    else {
        res.render('index');
    }
};

/* Obtain User */
router.get('/dashboard', ensureAuthenticated, function(req, res) {
    if(res.locals.user) {
        var id = res.locals.user.id;
        models.Messages.findAll({
            where: {
                user: id
            },
            order: [
                ['id', 'DESC']
            ]
        }).then(function(result) {
            if(result !== undefined) {
                var messages = [];
                
                for(var i = 0; i < result.length; i++) {
                    result[i].dataValues.firstname = res.locals.user.firstname;
                    result[i].dataValues.profileImage = res.locals.user.profilepicture;
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
router.post('/dashboard', upload.any(), function(req, res) {

    var id = res.locals.user.id;
    var message = req.body.message;
    var image = '';
    var isValid = false;

    req.checkBody('message', 'Your post is empty').notEmpty();

    if(req.files[0] !== undefined) {
        var fileExt = validateProfilePic(req.files[0]);
        image = req.files[0].filename;
        var isValid = false;
        
        if(fileExt !== 'invalid') {
            isValid = true;
            image += fileExt;
            fs.rename(req.files[0].path, req.files[0].path + fileExt, function(err) {
                if(err) throw err;
            });
        }
        else {
            isValid = false;
        }
    }
    else {
        image = null;
        isValid = true;
    }

    var errors = req.validationErrors();
    if(errors && (image === null) ) {
        req.flash('error_msg', 'Empty post');
        res.redirect('/dashboard');
    }
    else if(isValid === false) {
        req.flash('error_msg', 'Invalid Profile Picture');
        fs.unlink(req.files[0].path, function(err) {
            if(err) throw err;
        });
        res.redirect('/dashboard');
    }
    else {
        /* Creating new message */
        var newMessage = {
            user: id,
            message: message,
            image: image,
            UserId: id
        };
        /* Posting new message */
        models.Messages.create(newMessage).then(function(message) {
            res.redirect('/dashboard');
        });
    }
});

/* Edit User Profile */
router.post('/update/profile/:id', function(req, res) {
    var id = req.params.id;

    models.User.update({
        firstname: req.body.firstname,
		lastname:  req.body.lastname,
		email: req.body.email,
		bio: req.body.bio
    },
    {
    	where: {
    		id: id
    	}
    }).then(function(todos) {
        res.send('success');
    });
});

/* Edit User Message */
router.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var updatedMessage = req.body.message;
    var date = new Date();

    console.log(updatedMessage);

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

router.post('/delete/:id', function(req, res) {
    var id = req.params.id;
    models.Messages.destroy(
    {
        where: {
            id: id
        }
    }).then(function(todos) {
        res.send('success');
    });
});

router.get('/message', function(req, res){
    models.Messages.findAll({
        include: [
            {
                model: models.User
            }
        ]
    }).then(function(message){
        res.send(message);
    });
});

/* Function to ckeck if file has valid extension */
function validateProfilePic(file) {
    var fileExt = '';
    var type = file.mimetype.trim();
    if( (type === 'image/jpeg') ||
        (type === 'image/jpg') ||
        (type === 'image/png' )) {
        if(file.size > 3000000) {
            return 'invalid';
        }
        else {
            if(file.mimetype == 'image/jpeg') {
                fileExt = ".jpeg";
                return fileExt;
            }
            else if(file.mimetype == 'image/jpg') {
                fileExt = ".jpg";
                return fileExt;
            }
            else if(file.mimetype == 'image/png') {
                fileExt = ".png";
                return fileExt;
            }
        }
    }
    else {
        return 'invalid';
    }
}

module.exports = router;
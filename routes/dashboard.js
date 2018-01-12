var path = require("path");
var express = require('express');
var router = express.Router();
var models = require("../models");
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'public/assets/images/post' });

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.render('index');
    }
};

/* Obtain */
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

    if(req.files[0] !== undefined){
        var fileExt = validateProfilePic(req.files[0]);
        image = req.files[0].filename;
        var isValid = false;
        
        if( (fileExt == '.jpeg') ||
            (fileExt == '.jpg') ||
            (fileExt == '.png') ) {
            isValid = true;
            image += fileExt;
            fs.renameSync(req.files[0].path, req.files[0].path + fileExt, function(err) {
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
    if(errors) {
        req.flash('error_msg', 'Empty post');
        res.redirect('/dashboard');
    }
    else if(isValid === false) {
        req.flash('error_msg', 'Invalid Profile Picture');
        fs.unlink(req.files[0].path, function(err){
            if(err) throw err;
        });
        res.redirect('/dashboard');
    }
    else {
        /* Creating new message */
        var newMessage = {
            // user: res.locals.user.firstname + " " + res.locals.user.lastname,
            user: id,
            message: message,
            image: image
        };
        /* Post new message */
        models.Messages.create(newMessage).then(function(message){
            // req.flash('success_msg', 'Message successfully sent');
            res.redirect('/dashboard');
        });
    }
});

/* Edit User Profile */
router.post('/update/profile/:id', function(req, res){
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
router.post('/update/:id', function(req, res){
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

router.post('/delete/:id', function(req, res){
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

/* Search Other Users */ 
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

function validateProfilePic(file) {
    /* [ 
        { 
            fieldname: 'profilepic',
            originalname: 'web_developer.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: 'public/images/profile',
            filename: '93e08f4b28c622f97c2b7342796bb633',
            path: 'public\\images\\profile\\93e08f4b28c622f97c2b7342796bb633',
            size: 52702 
        } 
    ] */
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
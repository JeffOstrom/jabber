var path = require("path");
var express = require('express');
var router = express.Router();

router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
	res.render('dashboard');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.render('index');
    }
}
module.exports = router;
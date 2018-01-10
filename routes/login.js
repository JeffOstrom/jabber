var path = require("path");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/signin', ensureAuthenticated, function(req, res) {
    res.render('dashboard');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.render('signin');
    }
}
module.exports = router;
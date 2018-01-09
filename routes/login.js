var path = require("path");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/signin', function(req, res) {

    res.render('signin');

});

module.exports = router;
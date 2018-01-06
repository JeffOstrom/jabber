var express = require('express');
var router = express.Router();

router.get('/signin', function(req, res) {
    res.render('signin');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/contactus', function(req, res) {
    res.render('contactus');
});

router.post('/dashboard', function(req, res) {
    res.render('dashboard');
});

module.exports = router;
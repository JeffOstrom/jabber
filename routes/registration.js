
var path = require("path");
var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res) {
    res.render('signup');
});


module.exports = router;
var path = require("path");
var express = require('express');
var router = express.Router();

router.get('/signin', function(req, res) {
    res.render('signin');
});



module.exports = router;


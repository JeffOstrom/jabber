var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

/* Init App */
var app = express();

/* View Engine */
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
// app.use(cookieParser());

/* Set Static Folder */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/signin', function(req, res){
    res.render('signin');
});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.get('/contactus', function(req, res){
    res.render('contactus');
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var contactus = require('./routes/contactus.js');
var dashboard = require('./routes/dashboard.js');
var index = require('./routes/index.js');
var login = require('./routes/login.js');
var registration = require('./routes/registration.js');
var expressValidator = require('express-validator');

var users = require('./routes/user.js')
var db = require('./models');

var index = require('./routes/index');
var users = require('./routes/user');

/* Init App */
var app = express();

/* View Engine */
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

/* Set Static Folder */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', contactus);
app.use('/', dashboard);
app.use('/', login);
app.use('/', registration);
app.use(expressValidator());

app.set('port', (process.env.PORT || 3000));

db.sequelize.sync({alter: true}).then(function() {
	app.listen(app.get('port'), function(){
	    console.log('Server started on port ' + app.get('port'));
	});
});

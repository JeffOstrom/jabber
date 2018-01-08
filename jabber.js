var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');

var session = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/*Database*/
var db = require('./models');

/*Routes*/
var contactus = require('./routes/contactus.js');
var dashboard = require('./routes/dashboard.js');
var index = require('./routes/index.js');
var login = require('./routes/login.js');
var registration = require('./routes/registration.js');
var index = require('./routes/index');

/* Init App */
var app = express();

/* View Engine */
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.use(cookieParser('asdf33g4w4hghjkuil8saef345')); // cookie parser must use the same secret as express-session.

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(session({
	secret: 'asdf33g4w4hghjkuil8saef345', // must match with the secret for cookie-parser
	resave: true,
	saveUninitialized: true,
	cookie: {
	    httpOnly: true,
	    expires: cookieExpirationDate // use expires instead of maxAge
	}
}));

app.use(passport.initialize());
app.use(passport.session());

/* Express Validator */
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

/* Set Static Folder */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', contactus);
app.use('/', dashboard);
app.use('/', login);
app.use('/', registration);
app.set('port', (process.env.PORT || 3000));

db.sequelize.sync({alter: true}).then(function() {
	app.listen(app.get('port'), function(){
	    console.log('Server started on port ' + app.get('port'));
	});
});

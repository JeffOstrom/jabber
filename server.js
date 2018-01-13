var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');

/* Database */
var db = require('./models');
/* Routes */
var contactus = require('./routes/contactus.js');
var dashboard = require('./routes/dashboard.js');
var index = require('./routes/index.js');
var login = require('./routes/login.js');
var registration = require('./routes/registration.js');

/* Init App */
var app = express();

/* View Engine */
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        formatDate: function (value, format) { return moment(value).format(format); }
    },
    defaultLayout: 'main'
});

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

/* Set Static Folder */
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('supersecret')); // cookie parser must use the same secret as express-session.

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(session({
	secret: 'supersecret', // must match with the secret for cookie-parser
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

/* Global Vars */
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/', contactus);
app.use('/', dashboard);
app.use('/', login);
app.use('/', registration);

app.set('port', (process.env.PORT || 3000));

db.Messages.belongsTo(db.User);
db.User.hasMany(db.Messages);

db.sequelize.sync().then(function() {
	app.listen(app.get('port'), function() {
	    console.log('Server started on port ' + app.get('port'));
	});
});

module.exports = app;
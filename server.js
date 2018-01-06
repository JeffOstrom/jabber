//Dependencies
const EXPRESS = require('express');
const BODYPARSER = require('body-parser');
const PATH = require('path');

const PORT = process.env.PORT || 3000; 
const APP = EXPRESS();

// BodyParser makes it possible for our server to interpret data sent to it.
APP.use(BODYPARSER.json());
APP.use(BODYPARSER.urlencoded({ extended: true }));
APP.use(BODYPARSER.text());
APP.use(BODYPARSER.json({ type: "application/vnd.api+json" }));

//path to serve static files.
// *NOTE: May need to change to your folder if different.
APP.use(EXPRESS.static(PATH.join(__dirname, '/public')));



// ROUTES might need to adjusted
var login = require('./routes/login.js');
APP.use("/", login);

var index = require('./routes/index.js');
APP.use("/", index);

var contact = require('.routes/contactus.js');
APP.use("/", contactus);

var dashboard = require('.routes/dashboard.js');
APP.use("/", dashboard);

var user = require('.routes/user.js');
APP.use("/", user);

var registration = require('.routes/registration.js');
APP.use("/", registration);



//Express Listener
APP.listen(PORT, function(){
	console.log("Listening on port:", PORT);
});


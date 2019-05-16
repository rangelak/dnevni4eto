// require dependencies
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();

// load routes
const stories = require('./routes/stories');
const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

// database config
const db = require('./config/database');


// connect to mongoose
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true 
	})
	.then(()=> console.log ('MongoDB connected...'))
	.catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout:'main',
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({
		extended:false
	}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express-session Middleware
app.use(session({
	secret: 'dnevnik za bulgarskiq pazar',
	resave: true,
	saveUninitialized: true,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// index route
app.get('/', (req, res) => {
	var display = "Добре дошли в dnevni4eto!";
	res.render('index', {
		title: display
	});
});


// about route
app.get('/about', (req, res) =>{
	res.render('about');
});


// use routes
app.use('/stories', stories);
app.use('/users', users);

// define port we are listening on 
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on ${port}`);
});
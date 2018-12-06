require('./db');
require('./auth.js');

const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const Review = mongoose.model('Review');

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));
// enable passport middleware
app.use(passport.initialize());
app.use(passport.session());
// now you can use {{user}} in your template!
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));


function filterRestaurant (query) {
	const filter = {};
	if(query.neighborhoods !== 'all'){
		filter.neighborhood = query.neighborhoods;
	}
	if(query.cuisines !== 'all'){
		filter.cuisine_type = query.cuisines;
	}
	if(query.price !== 'all'){
		filter.price = query.price;
	}
	return filter;
}

function addRestaurant(name, neighborhood, address, cuisine, price){
	new Restaurant({
			name: name, 
			neighborhood: neighborhood,
			address: address,
			cuisine_type: cuisine,
			price: price
		}).save(function(err, restaurant, count){
			console.log('created a new restaurnat', restaurant, count, err);
		});
}


function addReview(name, user, username, date, rating, comments){
	new Review({
			restaurant_name: name,
			user: user, 
			// check if username works fine
			username: username,
			date: date,
			rating: rating,
			comments: comments
		}).save(function(err, review, count){
			console.log('created a new review', review, count, err);
		});
}



app.get('/', (req, res) => {
	const filter = filterRestaurant(req.query);
	if(filter.neighborhood === undefined && filter.cuisine_type === undefined && filter.price === undefined) {
		Restaurant.find((err, result, count) => {
			res.render('index', {'restaurant': result});
		});
	}
	else{
		Restaurant.find(filter, function(err, result, count) {
			if(result){
				res.render('index', {'restaurant': result});
			}	
		});
	}
});


app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

        
app.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

app.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

app.get('/add', (req, res) => {
	if(res.locals.user === undefined){
		res.redirect('/login');
	}
	else{
		res.render('add');
	}
});

app.post('/add', (req, res) => {
	addRestaurant(req.body.name, req.body.neighborhood, req.body.address, req.body.cuisine_type, req.body.price);
	res.redirect('/');			
});


app.get('/restaurant/:slug', (req,res) =>{
	if(res.locals.user === undefined){
		res.redirect('/login');
	}
	else{
		Restaurant.findOne({'slug': req.params.slug}, (err, result, count) =>{
			Review.find({restaurant_name: result.name},(err, reviews, count) => {
				res.render('restaurant', {'restaurant': result, 'review': reviews});
			});
		});
	}
});

app.get('/reviews', (req,res) =>{
	Review.find((err, result, count) => {
			res.render('reviews', {'review': result});
	});
});

app.post('/reviews', (req,res) =>{
	addReview(req.body.name, res.locals.user, res.locals.user.username, req.body.date, req.body.rating, req.body.comments);
	Review.find((err, result, count) => {
			res.render('reviews', {'review': result});
	});
});


app.listen(process.env.PORT || 3000);
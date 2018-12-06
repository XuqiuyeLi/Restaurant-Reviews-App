const mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User');


// passport setup for user authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

class Users {
	constructor(username, email){
		this.username = username;
		this.email = email;
	}

} 

class Reviews {
	constructor(name, username, date, star_rating, comments){
		this.name = name;
		this.username = username;
		this.date = date;
		this.rating = star_rating;
		this.comments = comments;
	}

	getComments(){
		return this.comments = comments;
	}

	generateStars(){
		let HTMLstring = '';
		for(let i = 0; i < this.rating; i++){
			HTMLstring += '<span class="fa fa-star checked"></span>';
		}
		return HTMLstring;
	}

	addReviewToDB(){
		new Review({
			restaurant_name: this.name,
			// check if username works fine
			username: this.username,
			date: this.date,
			rating: this.rating,
			comments: this.comments
		}).save(function(err, review, count){
			console.log('created a new review', review, count, err);
		});
	}
}


class Restaurants {
	constructor(name, neighborhood, address, cuisine, price){
		this.name = name;
		this.neighborhood = neighborhood;
		this.address = address;
		this.cuisine = cuisine;
		this.price = price;
	}

	getNeighborhood(){
		return this.neighborhood;
	}

	getAddress(){
		return this.address;
	}

	getCuisine(){
		return this.cuisine;
	}

	addRestaurantToDB(){
		new Restaurant({
			name: this.name, 
			neighborhood: this.neighborhood,
			address: this.address,
			cuisine_type: this.cuisine,
			price: this.price
		}).save(function(err, restaurant, count){
			console.log('created a new restaurnat', restaurant, count, err);
		});
	}

}


module.exports = {
	Users: Users,
	Restaurants: Restaurants,
	Reviews: Reviews,
};


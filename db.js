const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');


// authenticated user generated with passport.js
const UserSchema = new mongoose.Schema({ });

UserSchema.plugin(passportLocalMongoose);


// restaurant
// * includes the basic info of the restaurant
// * can have multiple reviews from different users
// * user can save a restaurant to their list
const Restaurant = new mongoose.Schema({
  	name: {type: String, required: true},
  	neighborhood: {type: String, required: true},
  	address: {type: String, required: true},
  	cuisine_type: {type: String, required: true},
  	price: {type: String, required: true},
}, {
  	id: true
});

// a restaurant review
// * each review must have a related user
const Review = new mongoose.Schema({
  restaurant_name: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  username: {type: String, required: true},
  date: {type: String, required: true},
  rating: {type: Number, min: 1, max: 5, required: true},
  comments: {type: String, required: true},
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below

Restaurant.plugin(URLSlugs('restaurant name'));

mongoose.model('User', UserSchema);
mongoose.model('Restaurant', Restaurant);
mongoose.model('Review', Review);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
  // if we're in PRODUCTION mode, then read the configration from a file
  // use blocking file io to do this...
  const fs = require('fs');
  const path = require('path');
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);
  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
  // if we're not in PRODUCTION mode, then use
  dbconf = 'mongodb://localhost/yelp-clone';
}

mongoose.connect(dbconf);
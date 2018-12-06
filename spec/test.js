var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();


describe('createReviews', function() {
	let review;
	beforeEach(function() {
        review = new Reviews("Ippudo", "Elena", "11/18/2018", "4", "Best Ramen in New York City!");
    });

    it('comments should be "Best Ramen in..."', function() {
            expect(review.getComments()).toEqual('Best Ramen in New York City!');
    });

    it("name should be Ippudo", function() {
            expect(review.name).toEqual('Ippudo');
    });

    it("should generate html for star rating"), function(){
    		expect(review.generateStars()).toContain('<span>');
    }

});


describe('createRestaurants', function(){
	let restaurant;
	beforeEach(function() {
        restaurant = new Restaurants("Ippudo", "East Village", "65 4th Ave", "Japanese", "$$");
    });
	it("neighborhood should be East Villgae", function() {
            expect(restaurant.getNeighborhood()).toEqual('East Village');
    });

    it("cuisine should be Japanese"), function(){
    		expect(restaurant.getCuisine()).toEqual('Japanese');
    }

})
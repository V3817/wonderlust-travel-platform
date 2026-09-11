const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');

// Home Page
module.exports.home = wrapAsync(async (req, res) => {
    try {
        const totalListings = await Listing.countDocuments();
        const recentListings = await Listing.find({}).limit(6).populate('owner');
        
        res.render('listings/home', { totalListings, recentListings });
    } catch (error) {
        console.error('Home page error:', error);
        res.render('listings/home', { totalListings: 0, recentListings: [] });
    }
});

// Demo User Creation
module.exports.createDemoUser = wrapAsync(async (req, res) => {
    try {
        const User = require('../models/user');
        const fakeUser = new User({
            email: "fakeuser@example.com",
            username: "fakeuser"
        });
        let registerUser = await User.register(fakeUser, "hello123");
        res.send(registerUser);
    } catch (error) {
        console.error('Demo user creation error:', error);
        res.status(500).send('Error creating demo user: ' + error.message);
    }
});


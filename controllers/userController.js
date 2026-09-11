const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signUp');
};

// Handle User Signup
module.exports.signup = wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to WonderLust! Your account has been created successfully.');
            res.redirect('/listings');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
});

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

// Handle User Login
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to WonderLust!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    
    // Ensure session is saved before redirect
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
        }
        res.redirect(redirectUrl);
    });
};

// Handle User Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out successfully!');
        res.redirect('/');
    });
};

// User Profile
module.exports.profile = wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('users/profile', { user });
});

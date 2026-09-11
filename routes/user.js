const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { saveRedirectUrl, isGuest, isLoggedIn } = require('../middlewares');

// Signup Routes - Grouped using router.route()
router.route('/signup')
    .get(isGuest, userController.renderSignupForm)
    .post(isGuest, userController.signup);

// Login Routes - Grouped using router.route()
router.route('/login')
    .get(isGuest, userController.renderLoginForm)
    .post(
        isGuest,
        saveRedirectUrl,
        passport.authenticate('local', { 
            failureFlash: true, 
            failureRedirect: '/login' 
        }),
        userController.login
    );

// Logout Route - Single route
router.get('/logout', userController.logout);

// Profile Route - Single route
router.get('/profile', isLoggedIn, userController.profile);

module.exports = router;

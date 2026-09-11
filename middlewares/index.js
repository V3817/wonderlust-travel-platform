const ExpressError = require('../utils/ExpressError');
const { listingSchema, reviewSchema } = require('../schema');
const Listing = require('../models/listing');
const Review = require('../models/review');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ExpressError('Only image files are allowed!', 400), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (Cloudinary can handle larger files)
    }
});

// Export upload middleware
module.exports.upload = upload;

// Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next();
};

// Store return URL for redirect after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
        delete req.session.returnTo; // Clear it after saving to locals
    }
    next();
};

// Check if user is owner of listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }
    
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to perform this action.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Check if user is author of review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect(`/listings/${id}`);
    }
    
    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to perform this action.');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Validation middleware for listings
module.exports.validateListing = (req, res, next) => {
    console.log('Validating request body:', req.body);
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.log('Validation error:', error.details);
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', `Validation Error: ${msg}`);
        return res.redirect('back');
    }
    next();
};

// Validation middleware for reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', `Validation Error: ${msg}`);
        return res.redirect('back');
    }
    next();
};

// Check if user is guest (not logged in) - useful for signup/login pages
module.exports.isGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('success', 'You are already logged in.');
        return res.redirect('/listings');
    }
    next();
};

// Admin check middleware (for future use)
module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    
    if (!req.user.isAdmin) {
        req.flash('error', 'You do not have admin privileges.');
        return res.redirect('/listings');
    }
    next();
};

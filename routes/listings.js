const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { isLoggedIn, isOwner, validateListing, upload } = require('../middlewares');

// Listings Collection Routes - Grouped using router.route()
router.route('/')
    .get(listingController.index)           // GET /listings - Show all listings
    .post(isLoggedIn, upload.single('image'), validateListing, listingController.createListing); // POST /listings - Create new listing

// Search Route - Special route for search functionality
router.route('/search')
    .get(listingController.searchListings); // GET /listings/search

// New Listing Form Route - Must be before /:id routes to avoid conflicts
router.get('/new', isLoggedIn, listingController.renderNewForm); // GET /listings/new - Show create form

// Individual Listing Routes - Grouped using router.route()
router.route('/:id')
    .get(listingController.showListing)     // GET /listings/:id - Show specific listing
    .put(isLoggedIn, isOwner, upload.single('image'), validateListing, listingController.updateListing) // PUT /listings/:id - Update listing
    .delete(isLoggedIn, isOwner, listingController.destroyListing); // DELETE /listings/:id - Delete listing

// Edit Listing Form Route
router.get('/:id/edit', isLoggedIn, isOwner, listingController.renderEditForm); // GET /listings/:id/edit - Show edit form

module.exports = router;

const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../config/cloudinary');

// Index - Show all listings
module.exports.index = wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).populate('owner');
    res.render('listings/index', { allListings });
});

// New - Show form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
};

// Show - Display a specific listing
module.exports.showListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('owner');
    
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    
    res.render('listings/show', { listing });
});

// Create - Add new listing to database
module.exports.createListing = wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body);
    
    // Handle image upload from Cloudinary
    if (req.file) {
        newListing.image = req.file.path; // Cloudinary URL
        newListing.cloudinaryId = req.file.filename; // Store Cloudinary public ID for deletion
    } else {
        // Use default image if no file uploaded
        newListing.image = 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUwfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D';
    }
    
    newListing.owner = req.user._id;
    await newListing.save();
    
    req.flash('success', 'New Listing Created Successfully!');
    res.redirect('/listings');
});

// Edit - Show form to edit listing
module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    
    res.render('listings/edit', { listing });
});

// Update - Update listing in database
module.exports.updateListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    
    // Store old cloudinary ID for potential deletion
    const oldCloudinaryId = listing.cloudinaryId;
    
    // Update listing with new data
    Object.assign(listing, req.body);
    
    // Handle new image upload
    if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (oldCloudinaryId) {
            try {
                await cloudinary.uploader.destroy(oldCloudinaryId);
                console.log('Old image deleted from Cloudinary');
            } catch (error) {
                console.log('Error deleting old image from Cloudinary:', error.message);
            }
        }
        
        listing.image = req.file.path; // New Cloudinary URL
        listing.cloudinaryId = req.file.filename; // New Cloudinary public ID
    }
    
    await listing.save();
    
    req.flash('success', 'Listing Updated Successfully!');
    res.redirect(`/listings/${id}`);
});

// Destroy - Delete listing from database
module.exports.destroyListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    
    // Delete image from Cloudinary if it exists
    if (listing.cloudinaryId) {
        try {
            await cloudinary.uploader.destroy(listing.cloudinaryId);
            console.log('Image deleted from Cloudinary');
        } catch (error) {
            console.log('Error deleting image from Cloudinary:', error.message);
        }
    }
    
    await Listing.findByIdAndDelete(id);
    
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect('/listings');
});


// Search listings
module.exports.searchListings = wrapAsync(async (req, res) => {
    const { search } = req.query;
    let allListings;
    
    if (search) {
        allListings = await Listing.find({
            $or: [
                { location: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ]
        }).populate('owner');
    } else {
        allListings = await Listing.find({}).populate('owner');
    }
    
    res.render('listings/index', { allListings });
});

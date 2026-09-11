const Review = require('../models/review');
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');

// Create Review
module.exports.createReview = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }
    
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    req.flash('success', 'New Review Created Successfully!');
    res.redirect(`/listings/${listing._id}`);
});

// Delete Review
module.exports.destroyReview = wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/listings/${id}`);
});

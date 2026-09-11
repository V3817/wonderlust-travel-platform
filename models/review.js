const mongoose = require("mongoose");

// Connection is handled by app.js, no need to connect here

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

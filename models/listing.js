const mongoose=require('mongoose');
const Review=require('./review');

// Connection is handled by app.js, no need to connect here

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { 
    type: String, 
    required: true, 
    default: "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUwfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D",
    set: (v)=> v==='' ? 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUwfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D' : v
  },
  cloudinaryId: { type: String }, // Store Cloudinary public ID for image management
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
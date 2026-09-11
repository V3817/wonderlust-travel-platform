require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const { cloudinary } = require('./config/cloudinary');
const path = require('path');

async function uploadLocalImagesToCloudinary() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        // Find listings with local image paths
        const localImageListings = await Listing.find({
            image: { $regex: '^/uploads/' }
        });

        console.log(`Found ${localImageListings.length} listings with local images`);

        for (const listing of localImageListings) {
            console.log(`\nProcessing: ${listing.title}`);
            console.log(`Current image path: ${listing.image}`);

            // Extract filename from path
            const filename = path.basename(listing.image);
            const localImagePath = path.join(__dirname, 'public', 'uploads', filename);

            try {
                // Upload to Cloudinary
                console.log(`Uploading ${filename} to Cloudinary...`);
                const result = await cloudinary.uploader.upload(localImagePath, {
                    folder: 'wonderlust/listings',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                });

                // Update listing with Cloudinary URL
                listing.image = result.secure_url;
                listing.cloudinaryId = result.public_id;
                await listing.save();

                console.log(`✅ Successfully uploaded and updated: ${listing.title}`);
                console.log(`New image URL: ${result.secure_url}`);
            } catch (uploadError) {
                console.error(`❌ Error uploading ${filename}:`, uploadError.message);
            }
        }

        console.log('\n🎉 Migration completed!');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

uploadLocalImagesToCloudinary();

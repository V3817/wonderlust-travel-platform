/**
 * MongoDB Migration Script: Local to Atlas
 * This script helps migrate your existing data from local MongoDB to MongoDB Atlas
 */

const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const User = require('./models/user');
require('dotenv').config();

// Connection URIs
const LOCAL_URI = 'mongodb://127.0.0.1:27017/project';
const ATLAS_URI = process.env.MONGODB_URI;

console.log('🚀 Starting MongoDB Migration...');
console.log('📍 From: Local MongoDB');
console.log('📍 To: MongoDB Atlas');

async function migrateData() {
    let localConnection = null;
    let atlasConnection = null;
    
    try {
        // Validate Atlas URI
        if (!ATLAS_URI || ATLAS_URI.includes('<username>') || ATLAS_URI.includes('<password>')) {
            console.error('❌ Please update your MONGODB_URI in .env file with actual Atlas credentials');
            process.exit(1);
        }

        console.log('\n📥 Step 1: Connecting to Local MongoDB...');
        
        // Create separate connection for local database
        localConnection = mongoose.createConnection(LOCAL_URI, {
            bufferCommands: false,
        });
        
        await new Promise((resolve, reject) => {
            localConnection.on('connected', resolve);
            localConnection.on('error', reject);
        });
        
        console.log('✅ Connected to local MongoDB');

        // Define models for local connection
        const LocalListing = localConnection.model('Listing', Listing.schema);
        const LocalReview = localConnection.model('Review', Review.schema);
        const LocalUser = localConnection.model('User', User.schema);

        console.log('\n📤 Step 2: Fetching data from local database...');
        
        // Fetch all data from local database
        const listings = await LocalListing.find({}).lean();
        const reviews = await LocalReview.find({}).lean();
        const users = await LocalUser.find({}).lean();

        console.log(`📊 Found ${listings.length} listings, ${reviews.length} reviews, ${users.length} users`);

        // Close local connection
        await localConnection.close();
        console.log('✅ Local connection closed');

        console.log('\n☁️ Step 3: Connecting to MongoDB Atlas...');
        
        // Create separate connection for Atlas
        atlasConnection = mongoose.createConnection(ATLAS_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });
        
        await new Promise((resolve, reject) => {
            atlasConnection.on('connected', resolve);
            atlasConnection.on('error', reject);
        });
        
        console.log('✅ Connected to MongoDB Atlas');

        // Define models for Atlas connection
        const AtlasListing = atlasConnection.model('Listing', Listing.schema);
        const AtlasReview = atlasConnection.model('Review', Review.schema);
        const AtlasUser = atlasConnection.model('User', User.schema);

        console.log('\n💾 Step 4: Migrating data to Atlas...');

        // Clear existing data in Atlas (optional)
        console.log('🧹 Clearing existing data in Atlas...');
        await AtlasUser.deleteMany({});
        await AtlasReview.deleteMany({});
        await AtlasListing.deleteMany({});

        // Insert data into Atlas
        if (users.length > 0) {
            console.log(`📥 Migrating ${users.length} users...`);
            await AtlasUser.insertMany(users);
            console.log('✅ Users migrated successfully');
        }

        if (listings.length > 0) {
            console.log(`📥 Migrating ${listings.length} listings...`);
            await AtlasListing.insertMany(listings);
            console.log('✅ Listings migrated successfully');
        }

        if (reviews.length > 0) {
            console.log(`📥 Migrating ${reviews.length} reviews...`);
            await AtlasReview.insertMany(reviews);
            console.log('✅ Reviews migrated successfully');
        }

        console.log('\n🎉 Migration completed successfully!');
        console.log('📊 Migration Summary:');
        console.log(`   • Users: ${users.length}`);
        console.log(`   • Listings: ${listings.length}`);
        console.log(`   • Reviews: ${reviews.length}`);
        
        console.log('\n✅ Your application is now ready to use MongoDB Atlas!');
        console.log('💡 You can now start your application with: node app.js');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.log('💡 Check your MongoDB Atlas username and password in the connection string');
        } else if (error.message.includes('IP')) {
            console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas Network Access');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Check your internet connection and Atlas cluster URL');
        }
        
        process.exit(1);
    } finally {
        // Close connections
        if (localConnection) {
            await localConnection.close();
        }
        if (atlasConnection) {
            await atlasConnection.close();
        }
        console.log('\n🔌 Disconnected from databases');
    }
}

// Run migration
migrateData();

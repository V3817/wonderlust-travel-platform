/**
 * Atlas Connection Test
 * Quick script to test your MongoDB Atlas connection
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
    console.log('🧪 Testing MongoDB Atlas Connection...\n');
    
    const atlasUri = process.env.MONGODB_URI;
    
    // Validate URI format
    if (!atlasUri) {
        console.error('❌ MONGODB_URI not found in .env file');
        return;
    }
    
    if (atlasUri.includes('<username>') || atlasUri.includes('<password>')) {
        console.error('❌ Please replace <username> and <password> in your connection string');
        return;
    }
    
    if (!atlasUri.startsWith('mongodb+srv://')) {
        console.log('⚠️  Warning: This doesn\'t look like an Atlas connection string');
        console.log('   Atlas URIs should start with "mongodb+srv://"');
    }
    
    try {
        console.log('🔗 Connecting to Atlas...');
        
        await mongoose.connect(atlasUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000, // Increase timeout for testing
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log(`📍 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        console.log(`🔌 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
        
        // Test a simple operation
        console.log('\n🧪 Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📚 Found ${collections.length} collections:`, collections.map(c => c.name).join(', '));
        
        console.log('\n🎉 Atlas connection test successful!');
        console.log('💡 Your application is ready to use MongoDB Atlas');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('Authentication failed')) {
            console.log('\n💡 Troubleshooting tips:');
            console.log('   • Check your username and password in the connection string');
            console.log('   • Ensure the database user exists in Atlas');
            console.log('   • Verify user permissions');
        } else if (error.message.includes('IP') || error.message.includes('not allowed')) {
            console.log('\n💡 Network Access Issue:');
            console.log('   • Add your IP address to Atlas Network Access');
            console.log('   • Or allow access from anywhere (0.0.0.0/0)');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 DNS/Network Issue:');
            console.log('   • Check your internet connection');
            console.log('   • Verify the cluster URL is correct');
        }
        
        console.log('\n📖 See ATLAS_MIGRATION_GUIDE.md for detailed setup instructions');
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
}

// Run the test
testAtlasConnection();

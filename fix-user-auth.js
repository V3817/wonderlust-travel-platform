/**
 * Fix User Authentication Script
 * This script fixes the "No salt value stored" error by resetting user passwords
 */

const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

console.log('🔧 Fixing User Authentication Issues...');

async function fixUserAuth() {
    try {
        // Connect to Atlas
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Get all users
        const users = await User.find({});
        console.log(`👥 Found ${users.length} users to fix`);

        if (users.length === 0) {
            console.log('ℹ️ No users found. Creating a demo user...');
            
            // Create a demo user for testing
            const demoUser = new User({
                email: 'demo@wonderlust.com'
            });
            
            // Register with a password (this will create proper salt/hash)
            await User.register(demoUser, 'demo123');
            console.log('✅ Demo user created: demo@wonderlust.com / demo123');
            return;
        }

        console.log('\n🔄 Fixing authentication for existing users...');
        
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            console.log(`🔧 Fixing user ${i + 1}: ${user.email || user.username || 'Unknown'}`);
            
            try {
                // Check if user has proper salt/hash
                if (!user.salt || !user.hash) {
                    console.log(`  ⚠️ User missing salt/hash, resetting password...`);
                    
                    // Set a default password (users will need to reset)
                    await user.setPassword('tempPassword123');
                    await user.save();
                    
                    console.log(`  ✅ Password reset to 'tempPassword123' for ${user.email || user.username}`);
                } else {
                    console.log(`  ✅ User authentication data is intact`);
                }
            } catch (error) {
                console.log(`  ❌ Error fixing user: ${error.message}`);
            }
        }

        console.log('\n🎉 User authentication fix completed!');
        console.log('\n📝 Summary:');
        console.log(`   • Users processed: ${users.length}`);
        console.log(`   • Default password for reset users: 'tempPassword123'`);
        console.log('\n💡 Users with reset passwords should change them after login');
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
    }
}

// Run the fix
fixUserAuth();

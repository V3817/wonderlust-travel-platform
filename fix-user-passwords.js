require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function fixUserPasswords() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        // Get all users without proper authentication
        const usersWithoutAuth = await User.find({
            $or: [
                { salt: { $exists: false } },
                { hash: { $exists: false } },
                { salt: null },
                { hash: null },
                { salt: "" },
                { hash: "" }
            ]
        });
        
        // If no users found with above criteria, get all users (they all need fixing)
        if (usersWithoutAuth.length === 0) {
            const allUsers = await User.find({});
            console.log('Checking all users for authentication fields...');
            for (const user of allUsers) {
                if (!user.salt || !user.hash) {
                    usersWithoutAuth.push(user);
                }
            }
        }

        console.log(`Found ${usersWithoutAuth.length} users without proper authentication`);

        for (const user of usersWithoutAuth) {
            try {
                console.log(`\nFixing user: ${user.username} (${user.email})`);
                
                // Set a default password (users can change it later)
                const tempPassword = 'WonderLust@123';
                
                // Use setPassword method to properly hash the password
                await user.setPassword(tempPassword);
                await user.save();
                
                console.log(`✅ Fixed authentication for ${user.username}`);
                console.log(`   Temporary password: ${tempPassword}`);
            } catch (error) {
                console.error(`❌ Error fixing user ${user.username}:`, error.message);
            }
        }

        console.log('\n🎉 Password fix completed!');
        console.log('📝 All users now have temporary password: WonderLust@123');
        console.log('💡 Users should change their passwords after logging in');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUserPasswords();

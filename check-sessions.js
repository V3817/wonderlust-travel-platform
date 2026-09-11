/**
 * Session Verification Script
 * Check if sessions are being stored in MongoDB Atlas
 */

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Checking MongoDB Atlas session storage...');

async function checkSessions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Check if sessions collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sessionCollection = collections.find(col => col.name === 'sessions');

        if (sessionCollection) {
            console.log('✅ Sessions collection found');
            
            // Get session count and sample data
            const sessionsCol = mongoose.connection.db.collection('sessions');
            const sessionCount = await sessionsCol.countDocuments();
            console.log(`📊 Total sessions: ${sessionCount}`);

            if (sessionCount > 0) {
                console.log('\n📋 Recent sessions:');
                const recentSessions = await sessionsCol.find({})
                    .sort({ expires: -1 })
                    .limit(5)
                    .toArray();

                recentSessions.forEach((session, index) => {
                    console.log(`${index + 1}. Session ID: ${session._id}`);
                    console.log(`   Expires: ${session.expires}`);
                    if (session.session) {
                        const sessionData = JSON.parse(session.session);
                        if (sessionData.passport && sessionData.passport.user) {
                            console.log(`   User: ${sessionData.passport.user}`);
                        }
                    }
                    console.log('');
                });
            } else {
                console.log('ℹ️  No active sessions found');
                console.log('💡 Sessions will appear when users log in');
            }
        } else {
            console.log('⚠️  Sessions collection not found');
            console.log('💡 Collection will be created when first session is stored');
        }

        console.log('\n📈 All collections in database:');
        collections.forEach(col => {
            console.log(`   • ${col.name}`);
        });

    } catch (error) {
        console.error('❌ Error checking sessions:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
    }
}

checkSessions();

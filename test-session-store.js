/**
 * Session Store Test Script
 * Tests MongoDB Atlas session storage functionality
 */

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

console.log('🧪 Testing MongoDB Session Store...');

async function testSessionStore() {
    try {
        console.log('🔗 Connecting to MongoDB Atlas...');
        
        // Create session store
        const sessionStore = MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
            touchAfter: 24 * 3600,
            crypto: {
                secret: process.env.SESSION_SECRET
            },
            autoRemove: 'native',
            stringify: false
        });

        // Set up event listeners
        sessionStore.on('connected', () => {
            console.log('✅ Session store connected successfully');
        });

        sessionStore.on('error', (error) => {
            console.error('❌ Session store error:', error);
        });

        sessionStore.on('create', (sessionId) => {
            console.log(`📝 Session created: ${sessionId}`);
        });

        sessionStore.on('update', (sessionId) => {
            console.log(`🔄 Session updated: ${sessionId}`);
        });

        sessionStore.on('destroy', (sessionId) => {
            console.log(`🗑️ Session destroyed: ${sessionId}`);
        });

        // Test session operations
        console.log('\n🧪 Testing session operations...');
        
        // Create a test session
        const testSessionId = 'test-session-' + Date.now();
        const testSessionData = {
            user: {
                id: 'test-user-123',
                email: 'test@wonderlust.com'
            },
            views: 1,
            lastAccess: new Date()
        };

        console.log(`📝 Creating test session: ${testSessionId}`);
        await new Promise((resolve, reject) => {
            sessionStore.set(testSessionId, testSessionData, (error) => {
                if (error) reject(error);
                else {
                    console.log('✅ Session created successfully');
                    resolve();
                }
            });
        });

        // Retrieve the session
        console.log(`📖 Retrieving session: ${testSessionId}`);
        const retrievedSession = await new Promise((resolve, reject) => {
            sessionStore.get(testSessionId, (error, session) => {
                if (error) reject(error);
                else resolve(session);
            });
        });

        if (retrievedSession) {
            console.log('✅ Session retrieved successfully');
            console.log('📄 Session data:', JSON.stringify(retrievedSession, null, 2));
        } else {
            console.log('⚠️ Session not found');
        }

        // Update the session
        testSessionData.views = 2;
        testSessionData.lastAccess = new Date();
        
        console.log(`🔄 Updating session: ${testSessionId}`);
        await new Promise((resolve, reject) => {
            sessionStore.set(testSessionId, testSessionData, (error) => {
                if (error) reject(error);
                else {
                    console.log('✅ Session updated successfully');
                    resolve();
                }
            });
        });

        // Clean up - destroy the test session
        console.log(`🗑️ Cleaning up test session: ${testSessionId}`);
        await new Promise((resolve, reject) => {
            sessionStore.destroy(testSessionId, (error) => {
                if (error) reject(error);
                else {
                    console.log('✅ Session destroyed successfully');
                    resolve();
                }
            });
        });

        console.log('\n🎉 Session store test completed successfully!');
        console.log('💡 Your application is ready to use MongoDB session storage');

        // Show session collection info
        await mongoose.connect(process.env.MONGODB_URI);
        const sessionCollection = mongoose.connection.db.collection('sessions');
        const sessionCount = await sessionCollection.countDocuments();
        console.log(`📊 Current sessions in database: ${sessionCount}`);

    } catch (error) {
        console.error('❌ Session store test failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
}

// Run the test
testSessionStore();

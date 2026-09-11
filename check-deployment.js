#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 * Validates your application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 WonderLust Deployment Checker\n');

let checksPassed = 0;
let totalChecks = 0;

function check(description, condition, fix = '') {
    totalChecks++;
    if (condition) {
        console.log(`✅ ${description}`);
        checksPassed++;
    } else {
        console.log(`❌ ${description}`);
        if (fix) console.log(`   💡 Fix: ${fix}`);
    }
}

// Check 1: Environment Variables
console.log('🔧 Environment Variables:');
check('MONGODB_URI is set', !!process.env.MONGODB_URI, 'Set MONGODB_URI in .env');
check('SESSION_SECRET is set', !!process.env.SESSION_SECRET, 'Set SESSION_SECRET in .env');
check('CLOUDINARY_CLOUD_NAME is set', !!process.env.CLOUDINARY_CLOUD_NAME, 'Set Cloudinary credentials');
check('CLOUDINARY_API_KEY is set', !!process.env.CLOUDINARY_API_KEY, 'Set Cloudinary credentials');
check('CLOUDINARY_API_SECRET is set', !!process.env.CLOUDINARY_API_SECRET, 'Set Cloudinary credentials');

// Check 2: Package.json
console.log('\n📦 Package Configuration:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
check('Start script defined', !!packageJson.scripts?.start, 'Add "start": "node app.js" to scripts');
check('Node engine specified', !!packageJson.engines?.node, 'Add engines.node to package.json');
check('Main file is app.js', packageJson.main === 'app.js', 'Set main to "app.js"');

// Check 3: Required Files
console.log('\n📁 Required Files:');
check('app.js exists', fs.existsSync('app.js'));
check('package.json exists', fs.existsSync('package.json'));
check('.gitignore exists', fs.existsSync('.gitignore'), 'Create .gitignore file');
check('README.md exists', fs.existsSync('README.md'), 'Create README.md file');

// Check 4: Security
console.log('\n🔒 Security:');
check('SESSION_SECRET is secure (>32 chars)', process.env.SESSION_SECRET?.length > 32, 'Use a longer, random session secret');
check('NODE_ENV is production', process.env.NODE_ENV === 'production', 'Set NODE_ENV=production');
check('.env not in git', !fs.existsSync('.env') || fs.readFileSync('.gitignore', 'utf8').includes('.env'), 'Add .env to .gitignore');

// Check 5: Database
console.log('\n🗄️  Database:');
check('MongoDB Atlas URI format', process.env.MONGODB_URI?.startsWith('mongodb+srv://'), 'Use MongoDB Atlas connection string');
check('Database name specified', process.env.MONGODB_URI?.includes('/wonderlust'), 'Add database name to connection string');

// Check 6: Directory Structure
console.log('\n📂 Project Structure:');
check('models/ directory exists', fs.existsSync('models'));
check('routes/ directory exists', fs.existsSync('routes'));
check('views/ directory exists', fs.existsSync('views'));
check('public/ directory exists', fs.existsSync('public'));
check('controllers/ directory exists', fs.existsSync('controllers'));

// Summary
console.log('\n📊 Deployment Readiness Summary:');
console.log(`✅ Passed: ${checksPassed}/${totalChecks} checks`);

if (checksPassed === totalChecks) {
    console.log('\n🎉 Your application is ready for deployment!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Commit your code to Git');
    console.log('2. Push to GitHub');
    console.log('3. Deploy to your chosen platform');
    console.log('4. Configure environment variables on the platform');
    console.log('5. Test the deployed application');
} else {
    console.log('\n⚠️  Please fix the failed checks before deployment');
    console.log('💡 Refer to DEPLOYMENT_GUIDE.md for detailed instructions');
}

console.log('\n📖 For detailed deployment instructions, see:');
console.log('   • DEPLOYMENT_GUIDE.md');
console.log('   • SESSION_STORAGE_GUIDE.md');
console.log('   • ATLAS_MIGRATION_GUIDE.md');

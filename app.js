const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Load environment variables
require('dotenv').config();

// Import route modules
const listingRoutes = require('./routes/listings');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const homeController = require('./controllers/homeController');

// Connect to MongoDB
main()
.then(() => {
  console.log("✅ Connected to MongoDB Atlas successfully");
  console.log(`📍 Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
})
.catch((err) => {
  console.error("❌ Error connecting to MongoDB", err.message);
  console.log("💡 Make sure your MongoDB Atlas connection string is correct in .env file");
  process.exit(1);
});

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project';
  
  await mongoose.connect(mongoUri, {
    // Atlas-optimized connection options
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });
}

// Middleware setup
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.set('trust proxy', 1); // Trust first proxy (required for Render/Heroku)

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax' // CSRF protection
  },
  name: 'wonderlust.session' // Custom session name
};

// Create session store with error handling
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project',
  collectionName: 'sessions',
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SESSION_SECRET || 'your-secret-key'
  },
  autoRemove: 'native',
  stringify: false
});

// Session store event listeners
sessionStore.on('connected', () => {
  console.log('✅ Session store connected to MongoDB Atlas');
});

sessionStore.on('error', (error) => {
  console.error('❌ Session store error:', error);
});

sessionStore.on('create', (sessionId) => {
  console.log('📝 Session created:', sessionId);
});

sessionStore.on('update', (sessionId) => {
  console.log('🔄 Session updated:', sessionId);
});

sessionStore.on('touch', (sessionId) => {
  console.log('👆 Session touched:', sessionId);
});

// Update session options to use the configured store
sessionOptions.store = sessionStore;

app.use(session(sessionOptions));
app.use(flash());

// Configure Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Manual serialization/deserialization for better debugging
passport.serializeUser((user, done) => {
    console.log('🔐 Serializing user:', user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('🔓 Deserializing user ID:', id);
        const user = await User.findById(id);
        console.log('🔓 Found user:', user ? user.username : 'null');
        done(null, user);
    } catch (error) {
        console.log('🔓 Deserialization error:', error);
        done(error, null);
    }
});

// Global middleware for flash messages and user
app.use((req, res, next) => {
    // Debug authentication state (always show for debugging this issue)
    console.log(`🔍 [${req.method}] ${req.url} - Auth: ${req.isAuthenticated()} - User: ${req.user ? req.user.username : 'None'} - Session: ${req.sessionID}`);
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// Routes using router.route() concept
const mainRouter = express.Router();

// Home and Demo Routes - Grouped using router.route()
mainRouter.route('/')
    .get(homeController.home);

mainRouter.route('/demouser')
    .get(homeController.createDemoUser);

// Debug route for authentication testing
mainRouter.route('/debug-auth')
    .get((req, res) => {
        res.render('debug-auth');
    });

// Mount the main router
app.use('/', mainRouter);

// Mount feature-specific routes
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// 404 Handler - Most reliable approach
app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Express Error Handler:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString()
    });
    
    const status = err.statusCode || 500;
    const message = err.message || "Oh No, Something Went Wrong!";
    
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        res.status(status).json({ error: message });
    } else {
        res.status(status).render("error", { status, message });
    }
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to database');
})
.catch(err => {
    console.error('Database error:', err);
    process.exit(1);
});

// Basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false // Set to false for testing
    }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Debug middleware
app.use((req, res, next) => {
    console.log('\n=== REQUEST DEBUG ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    console.log('Is Authenticated:', req.isAuthenticated ? req.isAuthenticated() : 'N/A');
    console.log('User:', req.user ? req.user.username : 'Not logged in');
    console.log('====================\n');
    next();
});

// Test routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Session Test</h1>
        <p>Authenticated: ${req.isAuthenticated()}</p>
        <p>User: ${req.user ? req.user.username : 'None'}</p>
        <p>Session ID: ${req.sessionID}</p>
        <a href="/login">Login</a> | <a href="/logout">Logout</a>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <p>Test credentials: testuser / password123</p>
    `);
});

app.post('/login', 
    passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: false 
    }),
    (req, res) => {
        console.log('\n*** LOGIN SUCCESS ***');
        console.log('User after login:', req.user.username);
        console.log('Session after login:', req.session);
        console.log('Is authenticated after login:', req.isAuthenticated());
        console.log('**********************\n');
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.log('Logout error:', err);
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Session debug server running on http://localhost:3000');
    console.log('Test login with: testuser / password123');
});

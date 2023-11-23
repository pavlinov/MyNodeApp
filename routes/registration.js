const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Registration route to serve the form
router.get('/register', (req, res) => {
    const messages = req.session.messages || {};
    req.session.messages = {};
    res.render('register', { messages: messages });
});

// Handle registration form submission
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check if the entered passwords match
    if (password !== confirmPassword) {
        req.session.messages = { error: 'Passwords do not match.' };
        return res.redirect('/register');
    }

    // Check if the username already exists using the User model
    User.findByUsername(username, (err, existingUser) => {
        if (err) {
            res.status(500).send('Error checking for existing user.');
            return;
        }
        if (existingUser) {
            req.session.messages = { error: 'Username is already taken.' };
            return res.redirect('/register');
        }

        // Since the username doesn't exist, create a new user
        User.createUser(username, password, false /* admin */, true /* canEditArticles */, (err, newUser) => {
            if (err) {
                res.status(500).send('Error registering user.');
            } else {
                // Registration was successful, redirect to the login page
                req.session.messages = { success: 'Registration successful. Please log in.' };
                res.redirect('/login');
            }
        });
    });
});

module.exports = router;
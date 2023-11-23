const express = require('express');
const router = express.Router();
const db = require('../db');

// Handle login form submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.findUserByUsername(username, (err, user) => {
        if (err) {
            req.session.messages = { error: 'Database error occurred.' };
            return res.redirect('/login');
        }
        if (user && user.password === password) { // In a real-world scenario, use bcrypt to hash and compare passwords
            req.session.userId = user.id;
            req.session.messages = { success: 'Login successful.' };
            res.redirect('/');
        } else {
            req.session.messages = { error: 'Invalid username or password.' };
            res.redirect('/login');
        }
    });
});

// Before serving the login form, pass any messages to the template
router.get('/login', (req, res) => {
    const messages = req.session.messages || {};
    req.session.messages = {};
    res.render('login', { messages: messages });
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send('Could not log out, please try again.');
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = router;
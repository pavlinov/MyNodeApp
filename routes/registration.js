const express = require('express');
const router = express.Router();
const db = require('../db');

// Registration route to serve the form
router.get('/register', (req, res) => {
    const messages = req.session.messages || {};
    req.session.messages = {};
    res.render('register', { messages: messages });
});

// Handle registration form submission
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        req.session.messages = { error: 'Passwords do not match.' };
        return res.redirect('/register');
    }
    db.findUserByUsername(username, (err, row) => {
        if (row) {
            req.session.messages = { error: 'Username is already taken.' };
            return res.redirect('/register');
        } else {
            const insert = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.run(insert, [username, password], (err) => { // In a real scenario, hash the password first
                if (err) {
                    res.status(500).send('Error registering user.');
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
});

module.exports = router;
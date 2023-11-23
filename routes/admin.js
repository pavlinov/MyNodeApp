const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure this points to your db.js file
const requireLogin = require('../middlewares/requireLogin');

router.get('/user-management', requireLogin, (req, res) => {
    console.log(res.locals.currentUser);
    if (res.locals.currentUser.admin) {
        db.getAllUsers((err, users) => {
            if (err) {
                return res.status(500).send('Database error occurred.');
            }
            res.render('user-management', {  user: res.locals.currentUser, users: users });
        });
    } else {
        res.status(403).send('Unauthorized access.'); // Or redirect to another page
    }
});

router.post('/update-user', requireLogin, (req, res) => {
    if (!res.locals.currentUser.admin) {
        return res.status(403).send('Unauthorized access.');
    }

    // Extract data from the request body, you might want to validate it
    const { userId, admin, can_edit_articles } = req.body;
    console.log(req.body);

    db.updateUserFlags(userId, !!admin, !!can_edit_articles, (err) => {
        if (err) {
            req.session.messages = { error: 'Failed to update user ${userId} flags.' };
        } else {
            req.session.messages = { success: 'User ${userId} flags updated successfully.' };
        }
        res.redirect('/admin/user-management');
    });
});

module.exports = router;
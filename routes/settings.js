const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../db'); // You need to create a module for database operations
const requireLogin = require('../middlewares/requireLogin');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));  // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        // Use the original file extension and add a timestamp for uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Define the settings route handlers

// GET request for the settings page
router.get('/', requireLogin, (req, res) => {
    const currentUser = res.locals.currentUser;

    // Render settings page with currentUser data
    res.render('settings', {
        user: currentUser,
        messages: req.session.messages || {}
    });

    // Clear any messages if they exist
    req.session.messages = {};
});

// POST request to upload the user image
router.post('/image-upload', requireLogin, upload.single('userImage'), (req, res) => {
    if (!req.file) {
        // If multer did not upload a file, set an error message
        req.session.messages = { error: 'File upload failed.' };
        return res.redirect('/settings');
    }

    const userId = req.session.userId;
    const imagePath = path.join('/uploads/', req.file.filename);

    // Update the user's profile image in the database
    db.updateUserImage(userId, imagePath, (err) => {
        if (err) {
            // Handle database errors and set an error message
            req.session.messages = { error: 'Error updating profile image in the database.' };
            return res.redirect('/settings');
        }

        // If the image has been updated successfully, set a success message
        req.session.messages = { success: 'Profile image updated successfully.' };
        res.redirect('/settings');
    });
});

// POST request to update user permissions

router.post('/permissions', requireLogin, (req, res) => {
    // You might want to validate req.body.canEditArticles before proceeding
    // Convert checkbox value to a boolean
    const canEditArticles = !!req.body.canEditArticles;
    console.log(canEditArticles);

    // Retrieve user ID from session
    const userId = req.session.userId;

    // Update user permissions in the database
    db.updateUserPermission(userId, canEditArticles, (err) => {
        if (err) {
            // If there is a database error, store an error message in the session
            req.session.messages = { error: 'Error updating user permissions.' };
        } else {
            // On success, store a success message in the session
            req.session.messages = { success: 'User permissions updated successfully.' };
        }
        // Redirect back to the settings page in both cases
        return res.redirect('/settings');
    });
});

router.post('/update-bio', requireLogin, (req, res) => {
    const bio = req.body.bio.trim();
    const userId = res.locals.currentUser.id;

    db.updateUserBio(userId, bio, (err) => {
        if (err) {
            req.session.messages = { error: 'Failed to update bio.' };
        } else {
            // Update the current user object as well, so you don't need a refresh for the bio to update
            res.locals.currentUser.bio = bio;
            
            req.session.messages = { success: 'Bio updated successfully.' };
        }
        res.redirect('/settings');
    });
});


module.exports = router;

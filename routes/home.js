const express = require('express');
const router = express.Router();

// Index route (home or login page)
router.get('/', (req, res) => {
  // Check if the currentUser information is available indicating that the user is logged in
  if (res.locals.currentUser) {
    const messages = req.session.messages || {};
    // Clear session messages after displaying them
    req.session.messages = {};

    // Render the home page with the currentUser's data
    res.render('home', { user: res.locals.currentUser, messages: messages });
  } else {
    // If the user is not logged in, redirect to the login page
    res.redirect('/login');
  }
});

module.exports = router;
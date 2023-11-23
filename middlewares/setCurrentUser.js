const db = require('../db'); 

const setCurrentUser = (req, res, next) => {
    if (req.session.userId) {
        db.findUserById(req.session.userId, (err, user) => {
            if (!err && user) {
                // Store the user object in res.locals, making it available to templates
                res.locals.currentUser = user;
            }
            // Call next() even if there was an error or user was not found
            next();
        });
    } else {
        // If no userId is found in session, no user is logged in
        next();
    }
};

module.exports = setCurrentUser;
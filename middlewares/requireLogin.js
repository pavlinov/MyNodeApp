// Middleware to protect settings route
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next(); // allow the next route to run
    } else {
        // require the user to log in
        res.redirect('/login'); // or render a form, etc.
    }
}
module.exports = requireLogin;

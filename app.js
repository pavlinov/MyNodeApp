const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const setCurrentUser = require('./middlewares/setCurrentUser');

const loginLogoutRoutes = require('./routes/login-logout');
const homeRoutes = require('./routes/home');
const registrationRoutes = require('./routes/registration');
const settingsRoutes = require('./routes/settings');
const articlesRouter = require('./routes/articles');
const adminRouter = require('./routes/admin');


const app = express();

const db = require('./db.js');

// Using ejs as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express-session for handling user sessions
app.use(session({
  secret: 'my_secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(setCurrentUser); // Set the currentUser in res.locals


// Routes
app.use('/', loginLogoutRoutes);
app.use('/', registrationRoutes);
app.use('/', homeRoutes);
app.use('/settings', settingsRoutes);
app.use('/articles', articlesRouter);
app.use('/admin', adminRouter);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
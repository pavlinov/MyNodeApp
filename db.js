const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'users.db'); 

// Open a database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Find a user by username
const findUserByUsername = (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, row) => {
        callback(err, row);
    });
};

// Find a user by ID
const findUserById = (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], (err, row) => {
        callback(err, row);
    });
};

// Create a new user
const createUser = (username, password, callback) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(query, [username, password], function(err) {
        callback(err);
    });
};

// Update a user's profile image
const updateUserImage = (userId, imagePath, callback) => {
    const query = 'UPDATE users SET profile_image = ? WHERE id = ?';
    db.run(query, [imagePath, userId], function(err) {
        callback(err);
    });
};

// Update a user's permission to edit articles
const updateUserPermission = (userId, canEditArticles, callback) => {
    const query = 'UPDATE users SET can_edit_articles = ? WHERE id = ?';
    // print prepared query
    db.run(query, [canEditArticles ? 1 : 0, userId], function(err) {
        callback(err);
    });
};

// Update a user's bio
const updateUserBio = (userId, bio, callback) => {
    const sql = 'UPDATE users SET bio = ? WHERE id = ?';
    db.run(sql, [bio, userId], (err) => {
        callback(err);
    });
};

// Retrieve all articles
const getAllArticles = (callback) => {
    const query = 'SELECT * FROM articles';
    db.all(query, [], (err, rows) => {
        callback(err, rows);
    });
};

const getAllUsers = (callback) => {
    const sql = 'SELECT id, username, admin, can_edit_articles FROM users';
    db.all(sql, [], (err, users) => {
        callback(err, users);
    });
};

const updateUserFlags = (userId, admin, canEditArticles, callback) => {
    const sql = 'UPDATE users SET admin = ?, can_edit_articles = ? WHERE id = ?';
    db.run(sql, [admin ? 1 : 0, canEditArticles ? 1 : 0, userId], (err) => {
        callback(err);
    });
};

module.exports = {
    findUserByUsername,
    findUserById,
    createUser,
    updateUserImage,
    updateUserPermission,
    getAllArticles,
    getAllUsers,
    updateUserFlags,
    updateUserBio,
    db,
};

const db = require('../db');

class User {
    constructor(id, username, password, admin, canEditArticles) {
        this.id = id;
        this.username = username;
        this.password = password; // In a real-world application, ensure this is hashed!
        this.admin = admin;
        this.canEditArticles = canEditArticles;
    }

    // Save the user instance to the database (for both create and update operations)
    save(callback) {
        if (this.id) {
            // Updating an existing user
            const sql = `UPDATE users SET username = ?, password = ?, admin = ?, can_edit_articles = ? WHERE id = ?;`
            db.db.run(sql, [this.username, this.password, this.admin, this.canEditArticles, this.id], callback);
        } else {
            // Inserting a new user
            const sql = `INSERT INTO users (username, password, admin, can_edit_articles) VALUES (?, ?, ?, ?);`
            db.run(sql, [this.username, this.password, this.admin, this.canEditArticles], function(err) {
                callback(err, { id: this.lastID });
            });
        }
    }

    // Add static method to find a user by username
    static findByUsername(username, callback) {
        const sql = `SELECT * FROM users WHERE username = ?;`
        db.db.get(sql, [username], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            if (row) {
                const user = new User(row.id, row.username, row.password, row.admin, row.can_edit_articles);
                callback(null, user);
            } else {
                callback(null, null);
            }
        });
    }

    static findByUsername(username, callback) {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) return callback(err);
            if (row) return callback(null, new User(row.id, row.username, row.password, row.admin, row.can_edit_articles));
            return callback();
        });
    }
    
    static findById(id, callback) {
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
            if (err) return callback(err);
            if (row) return callback(null, new User(row.id, row.username, row.password, row.admin, row.can_edit_articles));
            return callback();
        });
    }
    
    static createUser(username, password, admin = false, canEditArticles = false, callback) {
        db.run(`INSERT INTO users (username, password, admin, can_edit_articles) VALUES (?, ?, ?, ?)`, 
        [username, password, admin, canEditArticles], 
        function(err) {
            if (err) return callback(err);
            return callback(null, { id: this.lastID });
        });
    }
    
    static updateUserImage(imagePath, callback) {
        db.run(`UPDATE users SET profile_image = ? WHERE id = ?`, 
        [imagePath, this.id], callback);
    }
    
    static updateUserPermission(canEditArticles, callback) {
        db.run(`UPDATE users SET can_edit_articles = ? WHERE id = ?`, 
        [canEditArticles, this.id], callback);
    }
    
    static updateUserBio(bio, callback) {
        db.run(`UPDATE users SET bio = ? WHERE id = ?`, 
        [bio, this.id], callback);
    }
    

    static getAllUsers(callback) {
        db.all(`SELECT * FROM users`, [], (err, users) => {
            if (err) return callback(err);
            return callback(null, users.map(user => new User(user.id, user.username, user.password, user.admin, user.can_edit_articles)));
        });
    }

    static updateUserFlags(id, admin, canEditArticles, callback) {
        db.run(`UPDATE users SET admin = ?, can_edit_articles = ? WHERE id = ?`, 
        [admin, canEditArticles, id], callback);
    }

}

module.exports = User;
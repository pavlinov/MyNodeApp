const db = require('../db');

class Article {
    constructor(id, title, content, authorId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
    }

    save(callback) {
        // If the article doesn't have an ID, it's new and should be inserted
        if (this.id === null) {
            const sql = 'INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)';
            db.db.run(sql, [this.title, this.content, this.authorId], function(err) {
                callback(err, { id: this.lastID });
            });
        } else {
            // If the article has an ID, it's existing and should be updated
            const sql = 'UPDATE articles SET title = ?, content = ?, author_id = ? WHERE id = ?';
            db.run(sql, [this.title, this.content, this.authorId, this.id], function(err) {
                callback(err);
            });
        }
    }

    static findById(id, callback) {
        // Fetch an article by id
        const sql = 'SELECT * FROM articles WHERE id = ?';
        db.db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Call the constructor to build an Article object
            const article = new Article(row.id, row.title, row.content, row.author_id);
            callback(null, article);
        });
    }

    // Static method to get all articles
    static getAll(callback) {
        const sql = 'SELECT * FROM articles';
        db.db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Transform each row into an Article instance
            const articles = rows.map(row => new Article(row.id, row.title, row.content, row.author_id));
            callback(null, articles);
        });
    }
}

module.exports = Article;
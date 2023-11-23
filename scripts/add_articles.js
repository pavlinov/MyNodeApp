const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Array of articles
const articles = [
    { title: 'First Article', content: 'Content of the first article.', author_id: 1 },
    { title: 'Second Article', content: 'Content of the second article.', author_id: 1 },
    { title: 'Third Article', content: 'Content of the third article.', author_id: 1 }
];

// Function to insert articles into the database
const insertArticles = (db, articles, callback) => {
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)");
        for (const article of articles) {
            stmt.run(article.title, article.content, article.author_id);
        }
        stmt.finalize();
    });
    if (typeof callback === "function") {
        callback();
    }
};

// Call the function and close the database connection afterward
insertArticles(db, articles, () => {
    db.close();
});

const sqlite3 = require('sqlite3').verbose();

// Set up database connection
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

// // Set up users table
// db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, password TEXT)', (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Table "users" created.');
// });

// db.run('INSERT INTO users (username, password) values("apavlinov", "temp1234")', (err) => {
// 	if (err){
// 		console.error(err.message);
// 	}
// 	console.log('User "opavlinov" inserted');
// });

db.run('UPDATE users SET admin = 1 WHERE username = "apavlinov"', (err) => {
  if (err){
    console.error(err.message);
  }
  console.log('User "apavlinov" updated');
});

// Function to run SQL commands for updating the database
function runSqlCommands(commands) {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        commands.forEach(command => {
            db.run(command, (err) => {
                if (err) {
                    console.error("Error executing command:", command, "\n", err.message);
                    db.run("ROLLBACK;");
                    throw err;
                }
            });
        });
        db.run("COMMIT;");
        console.log("Database update complete.");
    });
}

// Define the SQL commands for your update
const commands = [
    // Create a new temporary table with the new schema
    `CREATE TABLE IF NOT EXISTS users_new (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        bio TEXT,
        admin INTEGER DEFAULT 0,
        profile_image TEXT DEFAULT NULL,
        can_edit_articles INTEGER DEFAULT 0
    );`,

    // Copy data from the original table to the new table
    `INSERT INTO users_new (id, username, password, profile_image, bio, admin, can_edit_articles)
     SELECT id, username, password, profile_image, bio, admin, can_edit_articles FROM users;`,

    // Drop the old table
    `DROP TABLE users;`,

    // Rename the new table to the original table name
    `ALTER TABLE users_new RENAME TO users;`,

    // Create a new table called articles
    `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        FOREIGN KEY (author_id) REFERENCES users(id)
    );`,

    // Insert user records
    `INSERT INTO users (id, username, password, profile_image, bio, can_edit_articles, admin) VALUES 
    (1, 'apavlinov', 'temp1234', '/uploads/userImage-1700771202410-671999697.jpg', 'Alexey Pavlinov, a proficient Software Engineer from Ukraine, now live in Portugal, has been a key player at GeeksForLess since 2008. A graduate in Information Security from the National Shipbuilding University, Mykolaiv, Alexey also studied Civil and Industrial Engineering at the Odessa State Academy. His expertise spans a variety of technologies including Python, JavaScript, and AWS, with a special focus on developing and optimizing software for mobile gaming and domain management systems. Known for his problem-solving abilities and customer-oriented approach, Alexey excels in multi-project management and technical leadership. Fluent in Ukrainian, Russian, and English, he brings a global perspective to his work.', 1, 1),
    (2, 'asdf', 'temp123', '/uploads/userImage-1700768463171-428004868.png', 'Born in Seattle in 1985, Jane Doe became a renowned environmental scientist. She developed a passion for ecology during her childhood, spent in the lush Pacific Northwest. After earning her Ph.D. from UC Berkeley, Jane focused on climate change research, contributing significantly to sustainable agriculture practices. Her groundbreaking work earned her the National Science Award in 2020. Jane also advocates for science education in schools, believing it’s key to a sustainable future.', 0, 1),
    (3, 'asdfg', 'temp123', NULL, NULL, 0, 0);`,

    // Insert article records
  `INSERT INTO articles (id, title, content, author_id) VALUES (1, 'First Article', 'Content of the first article.', 1);`,
  `INSERT INTO articles (id, title, content, author_id) VALUES (2, 'Second Article', 'Content of the second article.', 1);`,
  `INSERT INTO articles (id, title, content, author_id) VALUES (3, 'Third Article', 'Content of the third article.', 1);`,
];

// Run the update commands
runSqlCommands(commands);

// Close the database connection when done
db.close();

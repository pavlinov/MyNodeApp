const express = require('express');
const router = express.Router();
const db = require('../db'); 
const requireLogin = require('../middlewares/requireLogin');
const Article = require('../models/Article');

// Define a route to display the list of articles
router.get('/', requireLogin, (req, res) => {
    Article.getAll((err, articles) => {
        if (err) {
            res.status(500).render('error', { error: 'Error fetching articles.' });
        } else {
            res.render('articles-list', { user: res.locals.currentUser, articles: articles });
        }
    });
});

router.post('/new', requireLogin, (req, res) => {
    const { title, content } = req.body;
    const authorId = res.locals.currentUser.id;

    // Create a new article instance
    const newArticle = new Article(null, title, content, authorId);

    // Save the instance, which will insert it into the database
    newArticle.save((err, savedArticle) => {
        if (err) {
            // Handle errors...
        } else {
            req.session.messages = { success: 'Article created successfully!' };
            res.redirect(`/articles/${savedArticle.id}`);
        }
    });
});

// Add more article-related route handlers here

module.exports = router;
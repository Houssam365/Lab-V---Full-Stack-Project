const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Routes protégées
router.post('/', auth, articleController.createArticle);
router.put('/:id', auth, articleController.updateArticle);
router.delete('/:id', auth, articleController.deleteArticle);

module.exports = router;

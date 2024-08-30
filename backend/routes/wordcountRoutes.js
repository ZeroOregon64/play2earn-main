// routes/wordcountRoutes.js
const express = require('express');
const router = express.Router();
const { getParagraphs, submitAnswer, createParagraph } = require('../controllers/wordcountController');

// Create a new paragraph
router.post('/create', createParagraph);

// Route to get paragraphs
router.get('/paragraphs/', getParagraphs);

// Route to submit an answer with ID as a route parameter
router.post('/submit-answer/:id', submitAnswer);

module.exports = router;

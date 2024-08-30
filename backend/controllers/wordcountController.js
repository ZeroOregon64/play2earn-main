// controllers/wordcountController.js
const Paragraph = require('../models/Paragraph');
const { ObjectId } = require('mongodb');

// Controller to create a new paragraph
const createParagraph = async (req, res) => {
  const { level, paragraph, word1, word2, word1count, word2count, points } = req.body;

  if (!level || !paragraph || !word1 || typeof word1count !== 'number' || typeof points !== 'number') {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newParagraph = new Paragraph({
      level,
      paragraph,
      word1,
      word2: word2 || '',
      word1count,
      word2count: word2count || 0,
      points
    });

    await newParagraph.save();
    res.status(201).json(newParagraph);
  } catch (err) {
    console.error('Error creating paragraph:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get paragraphs
const getParagraphs = async (req, res) => {
  const { level } = req.query;

  if (!level) {
    return res.status(400).json({ message: 'Level is required' });
  }

  try {
    const paragraphs = await Paragraph.find({ level });
    res.json(paragraphs);
  } catch (err) {
    console.error('Error fetching paragraphs:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to submit an answer
const submitAnswer = async (req, res) => {
  const { id } = req.params; // Extract id from route parameters
  const { word1count, word2count } = req.body; // Extract counts from request body

  // Validate input
  if (typeof word1count !== 'number' || (word2count !== undefined && typeof word2count !== 'number')) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Fetch the paragraph by ID
    const paragraph = await Paragraph.findById(id);

    if (!paragraph) {
      return res.status(404).json({ message: 'Paragraph not found' });
    }

    // Compare user's answer with correct values
    const correctWord1Count = paragraph.word1count;
    const correctWord2Count = paragraph.word2count || 0;
    const isCorrect = word1count === correctWord1Count && (word2count === correctWord2Count || !paragraph.word2count);

    // Respond with result and points
    res.json({
      correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect. Try again.',
      points: isCorrect ? paragraph.points : 0
    });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getParagraphs, submitAnswer, createParagraph };

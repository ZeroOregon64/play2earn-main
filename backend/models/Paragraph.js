// models/Paragraph.js
const mongoose = require('mongoose');

const ParagraphSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  word1: {
    type: String,
    required: true
  },
  word2: {
    type: String
  },
  word1count: {
    type: Number,
    required: true
  },
  word2count: {
    type: Number
  },
  points: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Paragraph', ParagraphSchema);

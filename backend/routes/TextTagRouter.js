const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const { spawn } = require('child_process');

const db = new sqlite3.Database('./annotation.db', (err) => {
  if (err) {
    console.error('Database opening error:', err);
  } else {
    console.log('Database opened successfully');
  }
});

router.get('/get_sentence', (req, res) => {
  const level = req.query.level || 1;

  db.get(`SELECT sentence FROM sentences WHERE level = ? ORDER BY RANDOM() LIMIT 1`, [level], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

router.post('/get_predicted_tags', (req, res) => {
  const sentence = req.body.sentence;
  const pythonProcess = spawn('python', ['TextTag.py', sentence]);
  
  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      console.error(`Error: ${errorOutput}`);
      return res.status(500).json({ error: 'Error predicting tags' });
    }
    
    try {
      const predictedTags = JSON.parse(output);
      res.json({ predicted_tags: predictedTags });
    } catch (error) {
      console.error('Error parsing Python output:', error);
      res.status(500).json({ error: 'Error processing tags' });
    }
  });
});

router.post('/save_annotation', (req, res) => {
  const { sentence, annotations, level } = req.body;
  const sentenceLower = sentence.toLowerCase();

  db.all('SELECT key, tag FROM predicted_tags WHERE sentence = ?', [sentenceLower], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const totalAnnotations = rows.length;
    let correctAnnotations = 0;

    annotations.forEach(annotation => {
      const { key, tag } = annotation;
      const row = rows.find(row => row.key.toLowerCase() === key.toLowerCase());

      if (row && row.tag === tag) {
        correctAnnotations++;
      }
    });

    res.json({ correct_annotations: correctAnnotations, total_annotations: totalAnnotations });
  });
});

module.exports = router;
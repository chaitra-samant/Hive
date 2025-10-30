const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.post('/', async (req, res) => {
  const newGame = new Game(req.body);
  try {
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
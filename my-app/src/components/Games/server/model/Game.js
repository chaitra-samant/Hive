const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{ type: String }],
  currentQuestion: { type: String },
  choices: [{ type: String }],
});

module.exports = mongoose.model('Game', gameSchema);
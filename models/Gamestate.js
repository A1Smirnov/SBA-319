// ./models/Gamestate.js

const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  type: String,
  resources: Object,
  constructionCost: Object,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } // Ссылка на игрока
}, { timestamps: true });

const GameState = mongoose.model('GameState', gameStateSchema);

module.exports = GameState;

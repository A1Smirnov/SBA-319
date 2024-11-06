// ./models/GameState.js

const mongoose = require('mongoose');

const gamestateSchema = new mongoose.Schema({
  type: String,
  resources: Object,
  constructionCost: Object,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } // Ссылка на игрока
}, { timestamps: true });

const Gamestate = mongoose.model('Gamestate', gamestateSchema);  // Обратите внимание на имя модели

module.exports = Gamestate;

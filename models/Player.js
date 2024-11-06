// ./models/Player.js

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }],
  resources: {
    energy: { type: Number, default: 100 },
    money: { type: Number, default: 500 },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);

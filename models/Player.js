// models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  resources: {
    money: { type: Number, default: 1000 },  // Starting money
    energy: { type: Number, default: 100 }    // Starting energy
  },
  buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }]
});

module.exports = mongoose.model('Player', playerSchema);

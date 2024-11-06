// models/Building.js
const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  type: { type: String, required: true },
  resources: {
    energy: { type: Number, required: true },
    money: { type: Number, required: true }
  },
  constructionCost: {
    energy: { type: Number, required: true },
    money: { type: Number, required: true }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  upgradedTo: { type: String, default: null },
});

module.exports = mongoose.model('Building', buildingSchema);
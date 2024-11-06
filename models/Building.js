// ./models/Building.js

const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  type: { type: String, required: true },
  resources: {
    energy: { type: Number, default: 0 },
    money: { type: Number, default: 0 }, 
  },
  constructionCost: {
    money: { type: Number, required: true },
    energy: { type: Number, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null } // Задано значение по умолчанию null
});

module.exports = mongoose.model('Building', buildingSchema);

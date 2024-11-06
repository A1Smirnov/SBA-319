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

buildingSchema.index({ owner: 1 });
buildingSchema.index({ type: 1 });
buildingSchema.index({ "resources.energy": 1 });

const Building = mongoose.model('Building', buildingSchema);

module.exports = mongoose.model('Building', buildingSchema);
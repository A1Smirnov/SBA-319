// ./routes/buildingRoutes.js

const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Player = require('../models/Player');

// Route to create a building for a player
router.post('/', async (req, res) => {
  try {
    const { buildingType, playerId } = req.body;

    console.log("Received buildingType:", buildingType, "for playerId:", playerId);

    if (!buildingType || !playerId) {
      return res.status(400).send('Building type or player ID missing');
    }

    // Find the building template
    const buildingTemplate = await Building.findOne({ type: buildingType });

    if (!buildingTemplate) {
      return res.status(404).send('Building type not found');
    }

    // Create a new building instance for the player
    const newBuilding = new Building({
      type: buildingTemplate.type,
      resources: buildingTemplate.resources,
      constructionCost: buildingTemplate.constructionCost,
      owner: playerId
    });

    // Save the new building instance
    const savedBuilding = await newBuilding.save();

    // Add the building to the player's buildings
    const player = await Player.findByIdAndUpdate(
      playerId,
      { $push: { buildings: savedBuilding._id } },
      { new: true }
    );

    if (!player) {
      return res.status(404).send('Player not found');
    }

    res.status(200).send({
      message: 'Building created and added to player',
      building: savedBuilding,
      player
    });
  } catch (error) {
    console.error('Error while building:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;

// ./routes/buildingRoutes.js

const express = require('express');
const router = express.Router();
const Building = require('../models/Building');  // Шаблон зданий
const Player = require('../models/Player');
const GameState = require('../models/Gamestate'); // Модель для gamestate

// Route to create a building for a player
router.post('/', async (req, res) => {
  try {
    const { buildingType, playerId } = req.body;

    console.log("Received buildingType:", buildingType, "for playerId:", playerId);

    if (!buildingType || !playerId) {
      return res.status(400).send('Building type or player ID missing');
    }

    // Find the building template
    const buildingTemplate = await Building.findOne({ type: buildingType, owner: null });

    if (!buildingTemplate) {
      return res.status(404).send('Building type not found or already owned');
    }

    // Create a new building instance for the player in gamestate
    const newBuilding = new GameState({
      type: buildingTemplate.type,
      resources: buildingTemplate.resources,
      constructionCost: buildingTemplate.constructionCost,
      owner: playerId
    });

    // Save the new building in gamestate
    const savedBuilding = await newBuilding.save();

    // Find the player and add the building to the player's gamestate
    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).send('Player not found');
    }

    // Add the new building to the player's gamestate reference
    player.buildings.push(savedBuilding._id);

    // Save the updated player object with the new building
    const updatedPlayer = await player.save();

    res.status(200).send({
      message: 'Building created and added to player',
      building: savedBuilding,
      player: updatedPlayer
    });
  } catch (error) {
    console.error('Error while building:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;

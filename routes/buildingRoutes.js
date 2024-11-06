// ./routes/buildingRoutes.js

const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Player = require('../models/Player');

// Route to create a building and add it to a player
router.post('/', async (req, res) => {
  try {
    const { type, resources, constructionCost, playerId } = req.body;

    // Log request data for debugging
    console.log("Request body:", req.body);

    // Validate input data
    if (!type || !resources || !constructionCost || !playerId) {
      return res.status(400).send('Missing required building or player data');
    }

    // Create a new building document
    const newBuilding = new Building({
      type,
      resources,
      constructionCost,
      owner: playerId
    });

    // Save the building to the database
    const savedBuilding = await newBuilding.save();

    // Find the player and add the building reference to the buildings array
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

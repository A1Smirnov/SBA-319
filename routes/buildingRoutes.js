// routes/buildingRoutes.js

const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Player = require('../models/Player');

// Route to get available buildings
router.get('/available', async (req, res) => {
    try {
        const buildings = await Building.find(); // Получаем все здания из базы данных
        res.json(buildings); // Возвращаем здания в формате JSON
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ error: 'An error occurred while fetching buildings.' });
    }
});

// Route to build a new building
router.post('/', async (req, res) => {
    try {
        const playerId = req.session.playerId;
    
        // Check if playerId exists in session
        if (!playerId) {
          return res.status(400).send('Player session not found. Please start the game first.');
        }
    
        // Find the player by ID
        const player = await Player.findById(playerId);
        if (!player) {
          return res.status(404).send('Player not found.');
        }
    
        // Retrieve the building type from the request body
        const { buildingType } = req.body;
    
        // Find the building type from the database
        const buildingData = await Building.findOne({ type: buildingType });
        if (!buildingData) {
          return res.status(400).send('Invalid building type.');
        }
    
        // Check if player has enough resources
        if (player.resources.money < buildingData.constructionCost.money ||
            player.resources.energy < buildingData.constructionCost.energy) {
          return res.status(400).send('Insufficient resources to build this structure.');
        }
    
        // Deduct resources from the player
        player.resources.money -= buildingData.constructionCost.money;
        player.resources.energy -= buildingData.constructionCost.energy;
    
        // Add the new building to the player's buildings array
        player.buildings.push({
          type: buildingData.type,
          resources: buildingData.resources
        });
    
        // Save the player with updated resources and buildings
        await player.save();
    
        res.status(200).send('Building constructed successfully.');
      } catch (error) {
        console.error('Error while building:', error);
        res.status(500).send('An error occurred while constructing the building.');
      }
    });

module.exports = router;

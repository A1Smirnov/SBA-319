// ./routes/game.js

const express = require('express');
const Player = require('../models/Player');
const Building = require('../models/Building'); 
const router = express.Router();

// Route to start a new game
router.post('/start', async (req, res) => {
  try {
    const playerName = req.body.name || 'Player';

    // Create a new player if not found
    let player = await Player.findOne({ name: playerName });
    if (!player) {
      player = new Player({ name: playerName });
      await player.save(); // Save player to MongoDB
    }

    // Save playerId in session for access in other routes
    req.session.playerId = player._id;
    res.redirect('/game');
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).send('An error occurred while starting the game.');
  }
});

// Route for game management
router.get('/', async (req, res) => {
  try {
    if (!req.session.playerId) {
      return res.redirect('/');
    }

    const player = await Player.findById(req.session.playerId).populate('buildings');

    if (!player) {
      return res.redirect('/');
    }

    // Fetch available buildings from MongoDB
    const availableBuildings = await Building.find({ owner: null });

    res.render('game', { player, availableBuildings });  // передаем игрока, его здания и доступные для строительства
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).send('An error occurred while loading the game.');
  }
});

module.exports = router;

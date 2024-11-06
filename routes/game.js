// ./routes/game.js

const express = require('express');
const Player = require('../models/Player'); // Import the Player model
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
    const player = await Player.findById(req.session.playerId).populate('buildings');

    if (!player) {
      return res.redirect('/');
    }

    res.render('game', { player });
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).send('An error occurred while loading the game.');
  }
});

module.exports = router;

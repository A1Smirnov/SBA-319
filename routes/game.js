// ./routes/game.js

const express = require('express');
const Player = require('../models/Player'); // Import players model
const router = express.Router();

// Route to start a new game
router.post('/start', async (req, res) => {
  const playerName = req.body.name; // Getting Name out of form
  const player = new Player({ name: playerName }); // Create new Player

  await player.save(); // Save player in Database
  req.session.playerId = player._id; // Save Player's ID in session
  req.session.playerName = player.name; // Save Player's Name in session

  res.redirect('/game'); // Redirect to game screen
});

// Route for game management
router.get('/', async (req, res) => {
  const player = await Player.findById(req.session.playerId).populate('buildings'); // Get player out of Database

  if (!player) {
    return res.redirect('/'); // If Player not found redirect to main
  }

  res.render('game', { player }); // Transfer whole object in template
});

module.exports = router;

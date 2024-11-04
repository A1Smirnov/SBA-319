// controllers/gameController.js
const Player = require('../models/Player');

exports.showGameScreen = async (req, res) => {
  const playerId = req.session.playerId;

  try {
    const player = await Player.findById(playerId).populate('buildings');
    if (!player) {
      return res.redirect('/');  // If player not found redirect to main screen
    }

    res.render('game', { player });
  } catch (error) {
    console.error("Error loading game screen:", error);
    res.status(500).send("Server Error!");
  }
};

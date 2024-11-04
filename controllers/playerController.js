// controllers/playerController.js
const Player = require('../models/Player');

exports.showStartScreen = (req, res) => {
  res.render('start');  // Render START screen with fill-up form
};

exports.startGame = async (req, res) => {
  const { name } = req.body;
  try {
    // Creating new player with "name" and give him resources and other at models/Player.js
    const newPlayer = new Player({ name });
    await newPlayer.save();

    // Saving player ID in session and send him to game dashboard
    req.session.playerId = newPlayer._id;
    res.redirect('/game');
  } catch (error) {
    console.error("Error with creating new Player:", error);
    res.status(500).send("Server error");
  }
};

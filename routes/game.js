// ./routes/game.js

const express = require('express');
const Player = require('../models/Player');
const Building = require('../models/Building'); // Импортируем модель Building
const router = express.Router();

// Route to start a new game
router.post('/start', async (req, res) => {
  try {
    const playerName = req.body.name || 'Player';

    // Создаём или получаем игрока
    let player = await Player.findOne({ name: playerName });
    if (!player) {
      player = new Player({ name: playerName });
      await player.save();
    }

    // Сохраняем playerId в сессии
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
      return res.redirect('/'); // Если игрок не найден, перенаправляем на главную
    }

    // Загружаем доступные здания из базы данных
    const availableBuildings = await Building.find();

    // Передаём игрока и доступные здания в шаблон
    res.render('game', { player, availableBuildings });
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).send('An error occurred while loading the game.');
  }
});

module.exports = router;


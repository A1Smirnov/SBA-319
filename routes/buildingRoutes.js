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
        const { buildingType } = req.body;
        const playerId = req.session.playerId; // Инициализация playerId из сессии

        if (!playerId) {
            console.error('Player ID not found in session.');
            return res.status(400).send('Player not logged in.');
        }

        const newBuilding = new Building({ type: buildingType });
        await newBuilding.save();

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).send('Player not found.');
        }
        player.buildings.push(newBuilding);
        await player.save();

        res.redirect('/game');
    } catch (error) {
        console.error('Error building:', error);
        res.status(500).send('An error occurred while building.');
    }
});

module.exports = router;

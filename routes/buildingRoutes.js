// ./routes/buildingRoutes.js

const express = require('express');
const router = express.Router();
const Building = require('../models/Building');  // Модель для шаблонов зданий
const Player = require('../models/Player');

// Route to get available buildings (where owner is null)
router.get('/available-buildings', async (req, res) => {
  try {
    // Получаем здания, у которых owner равен null
    const availableBuildings = await Building.find({ owner: null });

    res.status(200).json(availableBuildings);  // Отправляем список доступных зданий
  } catch (error) {
    console.error('Error fetching available buildings:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to create a building for a player
router.post('/', async (req, res) => {
  try {
    const { buildingType, playerId } = req.body;

    console.log("Received buildingType:", buildingType, "for playerId:", playerId);

    if (!buildingType || !playerId) {
      return res.status(400).send('Building type or player ID missing');
    }

    // Find the building template
    const buildingTemplate = await Building.findOne({ type: buildingType });

    if (!buildingTemplate) {
      return res.status(404).send('Building type not found');
    }

    // Create a new building instance for the player
    const newBuilding = new Building({
      type: buildingTemplate.type,
      resources: buildingTemplate.resources,
      constructionCost: buildingTemplate.constructionCost,
      owner: playerId
    });

    // Save the new building instance to the Building collection
    const savedBuilding = await newBuilding.save();

    // Add the building to the player's buildings
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

router.patch('/upgrade/:id', async (req, res) => {
  const { id } = req.params;
  const { newType } = req.body;  // Тип нового здания

  try {
    // Найдем здание по ID
    const building = await Building.findById(id);

    if (!building) {
      return res.status(404).send('Building not found');
    }

    // Проверяем, было ли уже обновлено здание
    if (building.upgradedTo) {
      return res.status(400).send('Building has already been upgraded');
    }

    // Поищем новое здание по типу, если оно существует
    const newBuildingTemplate = await Building.findOne({ type: newType });

    if (!newBuildingTemplate) {
      return res.status(404).send('New building type not found');
    }

    // Обновим тип здания и ресурсы
    building.type = newType;
    building.resources = newBuildingTemplate.resources;
    building.constructionCost = newBuildingTemplate.constructionCost;
    building.upgradedTo = newType;  // Отметим, что здание обновлено

    // Сохраним изменения
    await building.save();

    res.status(200).send({ message: 'Building upgraded successfully', building });
  } catch (error) {
    console.error('Error upgrading building:', error);
    res.status(500).send('Internal server error');
  }
});


// Route to remove a building for a player
router.delete('/:buildingId', async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { playerId } = req.body;

    // Find the building to remove
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).send('Building not found');
    }

    // Ensure the building belongs to the player
    if (building.owner.toString() !== playerId) {
      return res.status(403).send('This building does not belong to the player');
    }

    // Remove the building from the player's list
    await Player.findByIdAndUpdate(playerId, {
      $pull: { buildings: buildingId }
    });

    // Delete the building from the buildings collection
    await Building.findByIdAndDelete(buildingId);

    res.status(200).send('Building removed successfully');
  } catch (error) {
    console.error('Error removing building:', error);
    res.status(500).send('An error occurred while removing the building');
  }
});

module.exports = router;



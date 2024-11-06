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
  try {
    const { id } = req.params;  // ID здания, которое нужно обновить
    const { upgradeTo } = req.body;  // Тип здания для апгрейда (например, "zoo" или "greenhouse")

    // Проверяем, передан ли тип апгрейда
    if (!upgradeTo) {
      return res.status(400).send('Upgrade type is required');
    }

    // Находим здание по ID
    const building = await Building.findById(id);

    // Проверяем, найдено ли здание
    if (!building) {
      return res.status(404).send('Building not found');
    }

    // Логика апгрейда
    if (building.type === 'plantation' && upgradeTo === 'greenhouse') {
      // Преобразуем "plantation" в "greenhouse"
      building.type = 'greenhouse';
      building.constructionCost = {
        money: 200,
        energy: 30
      };
      building.resources = {
        energy: 10,
        money: 50
      };
    } else if (building.type === 'enclosure' && upgradeTo === 'zoo') {
      // Преобразуем "enclosure" в "zoo"
      building.type = 'zoo';
      building.constructionCost = {
        money: 300,
        energy: 50
      };
      building.resources = {
        energy: 20,
        money: 100
      };
    } else {
      // В случае неправильного апгрейда
      return res.status(400).send('Invalid upgrade');
    }

    // Сохраняем изменения в базе данных
    await building.save();

    // Ответ с успешным апгрейдом
    res.status(200).send({
      message: 'Building upgraded successfully',
      building  // Возвращаем обновленные данные здания
    });
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



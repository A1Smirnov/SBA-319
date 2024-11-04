// routes/index.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.showStartScreen);
router.post('/start', playerController.startGame);

module.exports = router;
const baseController = require('../controllers/baseController');
const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsCont');

router.get("/", baseController.buildHome);

module.exports = router;
const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsCont');
const { validateProject } = require('./validation');

// Specific routes first
router.get("/add", projectsController.projectsForm);
router.get("/edit/:id", projectsController.editForm);
router.delete("/:id", projectsController.deleteProject);
router.put("/:id", validateProject, projectsController.updateProject); // Add validation for PUT
router.post("/", validateProject, projectsController.addProject); // Add validation for POST

// Generic routes after
router.get("/", projectsController.getProjects);
router.get("/:id", projectsController.getOne);

module.exports = router;
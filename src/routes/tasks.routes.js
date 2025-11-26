const express = require('express');
const tasksController = require('../controllers/tasks.controller');

const router = express.Router();

router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);

router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;

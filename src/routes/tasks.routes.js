const express = require('express');
const {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  bulkCreateTasks,
  bulkDeleteTasks,
} = require('../controllers/tasks.controller');

const router = express.Router();

router.post('/bulk', bulkCreateTasks);
router.delete('/bulk', bulkDeleteTasks);

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
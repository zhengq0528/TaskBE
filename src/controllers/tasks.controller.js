const Task = require('../models/task.model');
const { tasks, generateId } = require('../models/task.store');
const { validateTaskPayload } = require('../validation/task.validation');

// GET /api/tasks
function getAllTasks(req, res) {
/*
      SQL (Postgres/MySQL):
      SELECT * FROM tasks;
      We probably want to have user ID for selecting particular users
 */
  const allTasks = Array.from(tasks.values());
  res.json({ data: allTasks });
}

// POST /api/tasks
function createTask(req, res) {


   /*  INSERT INTO tasks (id, title, description, status, priority, assignee, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7);*/
  const payload = req.body || {};

  const { valid, errors } = validateTaskPayload(payload, { isUpdate: false });

  if (!valid) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  const id = generateId();
  const now = new Date().toISOString();

  const newTask = new Task({
    id,
    title: payload.title,
    description: payload.description,
    status: payload.status,
    priority: payload.priority,
    assignee: payload.assignee,
    dueDate: payload.dueDate,
    createdAt: now,
    updatedAt: null,
    tags: payload.tags,
  });

  tasks.set(id, newTask);

  res.status(201).json({ data: newTask });
}

// GET /api/tasks/:id
function getTaskById(req, res) {
  const { id } = req.params;

  if (!tasks.has(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = tasks.get(id);
  res.json({ data: task });
}

// PUT /api/tasks/:id
function updateTask(req, res) {
  const { id } = req.params;
  const payload = req.body || {};

  if (!tasks.has(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { valid, errors } = validateTaskPayload(payload, { isUpdate: true });

  const existing = tasks.get(id);
  const now = new Date().toISOString();

  // Merge existing with incoming changes
  const updatedTask = new Task({
    ...existing,
    ...payload,
    id, // ensure id never changes
    createdAt: existing.createdAt,
    updatedAt: now,
    tags: payload.tags !== undefined ? payload.tags : existing.tags,
  });

  // SQL query UPDATE.....
  tasks.set(id, updatedTask);

  res.json({ data: updatedTask });
}

// DELETE /api/tasks/:id
function deleteTask(req, res) {
  const { id } = req.params;

  if (!tasks.has(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.delete(id);

  res.status(204).send();
}

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};

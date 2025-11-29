const Task = require('../models/task.model');
const { tasks, generateId } = require('../models/task.store');
const { validateTaskPayload } = require('../validation/task.validation');
const { getIo } = require('../realtime/socket');

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

  const io = getIo();
  if (io) {
    io.emit('task:created', newTask);
  }

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

  const io = getIo();
  if (io) {
    io.emit('task:updated', updatedTask);
  }

  res.json({ data: updatedTask });
}

// DELETE /api/tasks/:id
function deleteTask(req, res) {
  const { id } = req.params;

  if (!tasks.has(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.delete(id);

  const io = getIo();
  if (io) {
    io.emit('task:deleted', { id });
  }

  res.status(204).send();
}

// POST /api/tasks/bulk
// Body: { tasks: Array<Partial<Task>> }
function bulkCreateTasks(req, res) {
  const payload = req.body || {};
  const items = Array.isArray(payload.tasks) ? payload.tasks : [];

  if (items.length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['"tasks" must be a non-empty array'],
    });
  }

  const errors = [];
  const newTasks = [];

  const nowIso = () => new Date().toISOString();

  // First pass: validate all
  items.forEach((item, index) => {
    const { valid, errors: itemErrors } = validateTaskPayload(item || {}, {
      isUpdate: false,
    });

    if (!valid) {
      errors.push({
        index,
        errors: itemErrors,
      });
    }
  });

  if (errors.length > 0) {
    // Fail the whole batch if any item is invalid
    return res.status(400).json({
      error: 'Validation failed for one or more tasks',
      details: errors,
    });
  }

  // Second pass: create all tasks
  items.forEach((item) => {
    const id = generateId();
    const now = nowIso();

    const task = new Task({
      id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      assignee: item.assignee,
      dueDate: item.dueDate,
      createdAt: now,
      updatedAt: null,
      tags: item.tags,
    });

    tasks.set(id, task);
    newTasks.push(task);
  });

  const io = getIo();
  if (io) {
    newTasks.forEach((task) => {
      io.emit('task:created', task);
    });
  }



  return res.status(201).json({ data: newTasks });
}

// DELETE /api/tasks/bulk
// Body: { ids: string[] }
function bulkDeleteTasks(req, res) {
  const payload = req.body || {};
  const ids = Array.isArray(payload.ids) ? payload.ids : [];

  if (ids.length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['"ids" must be a non-empty array of task IDs'],
    });
  }

  const deletedIds = [];
  const notFoundIds = [];

  ids.forEach((id) => {
    if (typeof id !== 'string') {
      notFoundIds.push(id);
      return;
    }

    if (tasks.has(id)) {
      tasks.delete(id);
      deletedIds.push(id);
    } else {
      notFoundIds.push(id);
    }
  });

  const io = getIo();
  if (io) {
    deletedIds.forEach((id) => {
      io.emit('task:deleted', { id });
    });
  }

  return res.status(200).json({
    deletedIds,
    notFoundIds,
  });
}



module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  bulkCreateTasks,
  bulkDeleteTasks,
};

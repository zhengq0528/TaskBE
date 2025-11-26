const dummyTasks = [
  {
    id: '1',
    title: 'Sample backend task: set up API',
    description: 'Placeholder task',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Backend',
  },
  {
    id: '2',
    title: 'Sample backend task: design schema',
    status: 'todo',
    priority: 'medium',
  },
];

function getAllTasks(req, res) {
  res.json({ data: dummyTasks });
}

function createTask(req, res) {
  const payload = req.body || {};
  const newTask = { id: String(dummyTasks.length + 1), ...payload };
  res.status(201).json({ data: newTask });
}

function getTaskById(req, res) {
  const { id } = req.params;
  const task = dummyTasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ data: task });
}

function updateTask(req, res) {
  const { id } = req.params;
  const payload = req.body || {};
  const updatedTask = { id, ...payload };
  res.json({ data: updatedTask });
}

function deleteTask(req, res) {
  res.status(204).send();
}

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};

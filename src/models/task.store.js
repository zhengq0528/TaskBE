// src/models/task.store.js
const Task = require('./task.model');

// Use a Map<ID, Task> for fast lookup/update/delete
const tasks = new Map();

// Seed initial tasks (same as your dummyTasks array)
tasks.set('1', new Task({
  id: '1',
  title: 'Sample backend task: set up API',
  description: 'Placeholder task',
  status: 'in_progress',
  priority: 'high',
  assignee: 'Backend',
}));

tasks.set('2', new Task({
  id: '2',
  title: 'Sample backend task: design schema',
  status: 'todo',
  priority: 'medium',
}));

// simple counter for new ids (you could also use uuid)
let nextId = 3;

function generateId() {
  const id = String(nextId);
  nextId += 1;
  return id;
}

module.exports = {
  tasks,
  generateId,
};

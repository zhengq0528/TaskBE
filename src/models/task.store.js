// src/models/task.store.js
const Task = require('./task.model');

// In-memory storage
const tasks = new Map();

// Use startup time for seeded tasks
const now = new Date().toISOString();

tasks.set(
  '1',
  new Task({
    id: '1',
    title: 'Sample backend task: set up API',
    description: 'Placeholder task',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Backend',
    createdAt: now,
    updatedAt: null,
    tags: ['backend', 'api'],
  })
);

tasks.set(
  '2',
  new Task({
    id: '2',
    title: 'Sample backend task: design schema',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    createdAt: now,
    updatedAt: null,
    tags: ['design'],
  })
);

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

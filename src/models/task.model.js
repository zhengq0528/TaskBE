// src/models/task.model.js
class Task {
  constructor({
    id,
    title,
    description = '',
    status = 'todo',
    priority = 'medium',
    assignee = '',
    dueDate = null,
    createdAt,
    updatedAt = null,
    tags = [],
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;       // 'todo' | 'in_progress' | 'done'
    this.priority = priority;   // 'low' | 'medium' | 'high'
    this.assignee = assignee;
    this.dueDate = dueDate;     // ISO date string or null

    // mandatory timestamps
    this.createdAt = createdAt; // ISO datetime string
    this.updatedAt = updatedAt; // ISO datetime string or null
    this.tags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim()).filter(Boolean)
        : [];
  }
}

module.exports = Task;

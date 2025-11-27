class Task {
  constructor({
    id,
    title,
    description = '',
    status = 'todo',
    priority = 'medium',
    assignee = '',
    dueDate = null,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.assignee = assignee;
    this.dueDate = dueDate;
  }
}

module.exports = Task;

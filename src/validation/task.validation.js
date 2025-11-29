// src/validation/task.validation.js

/**
 * Validate TASK payload for create/update
 * Returns: { valid: boolean, errors: string[] }
 */

function validateTaskPayload(payload, { isUpdate = false } = {}) {
  const errors = [];

  // Required for CREATE
  if (!isUpdate) {
    if (!payload.title || typeof payload.title !== 'string') {
      errors.push("Field 'title' is required and must be a string.");
    }
    if (!payload.status) {
      errors.push("Field 'status' is required ('todo' | 'in_progress' | 'done').");
    }
  }

  // Optional-but-validated fields
  if (payload.title && typeof payload.title !== 'string') {
    errors.push("Field 'title' must be a string.");
  }

  if (payload.title && payload.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  if (payload.description && payload.description.length > 500) {
    errors.description = 'Description must be at most 500 characters';
  }

  if (payload.description && typeof payload.description !== 'string') {
    errors.push("Field 'description' must be a string.");
  }

  const validStatuses = ['todo', 'in_progress', 'done'];
  if (payload.status && !validStatuses.includes(payload.status)) {
    errors.push("Field 'status' must be one of: todo, in_progress, done.");
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (payload.priority && !validPriorities.includes(payload.priority)) {
    errors.push("Field 'priority' must be: low, medium, or high.");
  }

  if (payload.assignee && typeof payload.assignee !== 'string') {
    errors.push("Field 'assignee' must be a string.");
  }

  // Due date must be valid ISO date
  if (payload.dueDate) {
    const date = new Date(payload.dueDate);
    if (isNaN(date.getTime())) {
      errors.push("Field 'dueDate' must be a valid ISO date (YYYY-MM-DD).");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateTaskPayload,
};

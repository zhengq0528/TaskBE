// __tests__/tasks.api.test.js
const request = require('supertest');
const app = require('../src/index');
const { tasks } = require('../src/models/task.store');

describe('Tasks API', () => {
  beforeEach(() => {
    // start from empty store for predictable tests
    tasks.clear();
  });

  test('GET /api/tasks returns empty list initially', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  test('POST /api/tasks creates a task with timestamps and tags', async () => {
    const payload = {
      title: 'Write backend tests',
      status: 'todo',
      priority: 'medium',
      assignee: 'You',
      description: 'Add Jest tests',
      tags: ['backend', 'tests'],
    };

    const res = await request(app).post('/api/tasks').send(payload);

    expect(res.status).toBe(201);
    const task = res.body.data;

    expect(task.id).toBeDefined();
    expect(task.title).toBe(payload.title);
    expect(task.status).toBe(payload.status);
    expect(task.tags).toEqual(['backend', 'tests']);
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeNull();
  });

  test('PUT /api/tasks/:id updates task and sets updatedAt', async () => {
    // create a task first
    const createRes = await request(app).post('/api/tasks').send({
      title: 'Update me',
      status: 'todo',
    });
    const created = createRes.body.data;

    const updateRes = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send({ status: 'in_progress', tags: ['updated'] });

    expect(updateRes.status).toBe(200);
    const updated = updateRes.body.data;

    expect(updated.status).toBe('in_progress');
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt).not.toBeNull();
    expect(updated.tags).toEqual(['updated']);
  });

  test('POST /api/tasks fails validation if title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      status: 'todo',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
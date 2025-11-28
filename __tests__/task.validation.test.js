const { validateTaskPayload } = require('../src/validation/task.validation');

describe('validateTaskPayload - create', () => {
  test('accepts minimal valid create payload', () => {
    const { valid, errors } = validateTaskPayload(
      {
        title: 'Valid title',
        status: 'todo',
      },
      { isUpdate: false }
    );

    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('rejects missing title on create', () => {
    const { valid, errors } = validateTaskPayload(
      {
        status: 'todo',
      },
      { isUpdate: false }
    );

    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining([expect.stringContaining('title')])
    );
  });

  test('rejects invalid status', () => {
    const { valid, errors } = validateTaskPayload(
      {
        title: 'Bad status',
        status: 'not_a_status',
      },
      { isUpdate: false }
    );

    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining([expect.stringContaining('status')])
    );
  });

});

describe('validateTaskPayload - update', () => {
  test('allows partial update when isUpdate=true', () => {
    const { valid, errors } = validateTaskPayload(
      {
        status: 'done',
      },
      { isUpdate: true }
    );

    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });
});
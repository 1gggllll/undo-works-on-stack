const request = require('supertest');
const assert = require('assert');
const app = require('../server');

describe('API 接口测试', function() {
  this.timeout(10000);

  describe('GET /api/health', function() {
    it('应该返回健康状态', async function() {
      const res = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.strictEqual(res.body.status, 'OK');
      assert.ok(res.body.timestamp);
      assert.ok(res.body.message);
    });
  });

  describe('GET /api/todos', function() {
    it('应该返回待办事项列表', async function() {
      const res = await request(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });
  });

  describe('POST /api/todos', function() {
    it('应该成功添加新待办事项', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '测试待办事项' })
        .expect('Content-Type', /json/)
        .expect(201);

      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.id);
      assert.strictEqual(res.body.data.title, '测试待办事项');
      assert.strictEqual(res.body.data.completed, false);
    });

    it('应该拒绝空标题', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message);
    });

    it('应该拒绝无标题请求', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      assert.strictEqual(res.body.success, false);
    });
  });

  describe('PUT /api/todos/:id', function() {
    let todoId;

    before(async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '用于更新测试的待办事项' });
      todoId = res.body.data.id;
    });

    it('应该成功更新待办事项状态', async function() {
      const res = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true })
        .expect('Content-Type', /json/)
        .expect(200);

      assert.strictEqual(res.body.success, true);
    });
  });

  describe('DELETE /api/todos/:id', function() {
    let todoId;

    before(async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '用于删除测试的待办事项' });
      todoId = res.body.data.id;
    });

    it('应该成功删除待办事项', async function() {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      assert.strictEqual(res.body.success, true);
    });
  });
});
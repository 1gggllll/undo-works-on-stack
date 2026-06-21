const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database');
const { errorHandler, validateTodoRequest, asyncHandler } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 初始化数据库
database.initDatabase();

// API 路由
// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: '服务器运行正常'
  });
});

// 获取所有待办事项（支持分页）
app.get('/api/todos', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  
  const result = await database.getAllTodos(page, limit);
  res.json({ success: true, data: result.data, pagination: result.pagination });
}));

// 获取单个待办事项
app.get('/api/todos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await database.getTodoById(id);
  if (todo) {
    res.json({ success: true, data: todo });
  } else {
    res.status(404).json({ success: false, message: '待办事项不存在' });
  }
}));

// 添加新待办事项
app.post('/api/todos', validateTodoRequest, asyncHandler(async (req, res) => {
  const { title } = req.body;
  const newTodo = await database.addTodo(title);
  res.status(201).json({ success: true, data: newTodo });
}));

// 更新待办事项状态
app.put('/api/todos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  await database.updateTodo(id, completed);
  res.json({ success: true, message: '更新成功' });
}));

// 删除待办事项
app.delete('/api/todos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await database.deleteTodo(id);
  res.json({ success: true, message: '删除成功' });
}));

// 错误处理中间件
app.use(errorHandler);

// 前端路由（所有其他请求返回 index.html）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动，访问地址: http://localhost:${PORT}`);
  console.log(`API 地址: http://localhost:${PORT}/api`);
});

module.exports = app;
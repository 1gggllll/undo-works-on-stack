const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./database');

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

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await database.getAllTodos();
    res.json({ success: true, data: todos });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({ success: false, message: '获取待办事项失败' });
  }
});

// 添加新待办事项
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: '标题不能为空' });
    }
    const newTodo = await database.addTodo(title.trim());
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    console.error('添加待办事项失败:', error);
    res.status(500).json({ success: false, message: '添加待办事项失败' });
  }
});

// 更新待办事项状态
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await database.updateTodo(id, completed);
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新待办事项失败:', error);
    res.status(500).json({ success: false, message: '更新待办事项失败' });
  }
});

// 删除待办事项
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await database.deleteTodo(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    res.status(500).json({ success: false, message: '删除待办事项失败' });
  }
});

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
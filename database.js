const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'todos.db');

let db = null;

// 初始化数据库连接
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('数据库连接失败:', err.message);
        throw err;
      }
      console.log('已连接到 SQLite 数据库');
    });
  }
  return db;
}

// 初始化数据库表结构
function initDatabase() {
  const database = getDatabase();
  
  database.serialize(() => {
    // 创建 todos 表（如果不存在）
    database.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('创建表失败:', err.message);
      } else {
        console.log('数据库表已初始化');
      }
    });

    // 添加索引以优化查询性能
    database.run(`
      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)
    `, (err) => {
      if (err) {
        console.error('创建completed索引失败:', err.message);
      }
    });

    database.run(`
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at)
    `, (err) => {
      if (err) {
        console.error('创建created_at索引失败:', err.message);
      }
    });
  });
}

// 获取所有待办事项（支持分页）
function getAllTodos(page = 1, limit = 100) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    const offset = (page - 1) * limit;
    
    // 获取总数
    database.get('SELECT COUNT(*) as total FROM todos', [], (err, countResult) => {
      if (err) {
        reject(err);
        return;
      }
      
      // 获取分页数据
      const sql = 'SELECT * FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?';
      database.all(sql, [limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            data: rows,
            pagination: {
              page: page,
              limit: limit,
              total: countResult.total,
              totalPages: Math.ceil(countResult.total / limit)
            }
          });
        }
      });
    });
  });
}

// 根据ID获取单个待办事项
function getTodoById(id) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    const sql = 'SELECT * FROM todos WHERE id = ?';
    database.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

// 添加新待办事项
function addTodo(title) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    const sql = 'INSERT INTO todos (title) VALUES (?)';
    database.run(sql, [title], function(err) {
      if (err) {
        reject(err);
      } else {
        // 返回新创建的待办事项
        resolve({
          id: this.lastID,
          title: title,
          completed: false,
          created_at: new Date().toISOString()
        });
      }
    });
  });
}

// 更新待办事项状态
function updateTodo(id, completed) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    const sql = 'UPDATE todos SET completed = ? WHERE id = ?';
    database.run(sql, [completed ? 1 : 0, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

// 删除待办事项
function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    const sql = 'DELETE FROM todos WHERE id = ?';
    database.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

// 关闭数据库连接
function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('关闭数据库失败:', err.message);
      } else {
        console.log('数据库连接已关闭');
      }
    });
    db = null;
  }
}

module.exports = {
  initDatabase,
  getAllTodos,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  closeDatabase
};
// API 基础URL
const API_BASE = '/api';

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 页面加载时获取所有待办事项
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  
  // 添加事件监听器
  addButton.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
  
  // 使用事件委托处理待办事项列表中的事件
  todoList.addEventListener('click', (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    const todoId = todoItem.dataset.id;
    
    if (target.classList.contains('todo-checkbox')) {
      toggleTodo(todoId, target.checked);
    } else if (target.classList.contains('todo-delete')) {
      deleteTodo(todoId);
    }
  });
});

// 加载所有待办事项
async function loadTodos() {
  try {
    showLoading();
    const response = await fetch(`${API_BASE}/todos`);
    const data = await response.json();
    
    if (data.success) {
      renderTodos(data.data);
      updateStats(data.data);
    } else {
      showError('加载待办事项失败');
    }
  } catch (error) {
    console.error('加载失败:', error);
    showError('网络错误，请检查服务器是否运行');
  } finally {
    hideLoading();
  }
}

// 渲染待办事项列表
function renderTodos(todos) {
  // 使用DocumentFragment减少DOM重绘
  const fragment = document.createDocumentFragment();
  
  if (todos.length === 0) {
    emptyState.style.display = 'block';
    todoList.innerHTML = '';
    return;
  }
  
  emptyState.style.display = 'none';
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    
    const title = document.createElement('span');
    title.className = `todo-title ${todo.completed ? 'completed' : ''}`;
    title.textContent = todo.title;
    
    const date = document.createElement('span');
    date.className = 'todo-date';
    date.textContent = formatDate(todo.created_at);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete';
    deleteBtn.textContent = '删除';
    
    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(date);
    li.appendChild(deleteBtn);
    
    fragment.appendChild(li);
  });
  
  // 一次性更新DOM
  todoList.innerHTML = '';
  todoList.appendChild(fragment);
}

// 更新统计信息
function updateStats(todos) {
  totalCount.textContent = `总计: ${todos.length}`;
  const completed = todos.filter(todo => todo.completed).length;
  completedCount.textContent = `已完成: ${completed}`;
}

// 添加新待办事项（带防抖）
const addTodo = debounce(async function() {
  const title = todoInput.value.trim();
  
  if (!title) {
    showError('请输入待办事项标题');
    return;
  }
  
  try {
    addButton.disabled = true;
    addButton.innerHTML = '<span class="loading"></span>';
    
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });
    
    const data = await response.json();
    
    if (data.success) {
      todoInput.value = '';
      showSuccess('添加成功');
      loadTodos(); // 重新加载列表
    } else {
      showError(data.message || '添加失败');
    }
  } catch (error) {
    console.error('添加失败:', error);
    showError('添加失败，请检查网络连接');
  } finally {
    addButton.disabled = false;
    addButton.textContent = '添加';
  }
}, 300);

// 切换待办事项状态
async function toggleTodo(id, completed) {
  try {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // 更新本地状态
      const titleElement = document.querySelector(`[data-id="${id}"] .todo-title`);
      if (titleElement) {
        titleElement.classList.toggle('completed', completed);
      }
      
      // 更新统计
      loadTodos();
    } else {
      showError('更新失败');
      // 恢复复选框状态
      const checkbox = document.querySelector(`[data-id="${id}"] .todo-checkbox`);
      if (checkbox) {
        checkbox.checked = !completed;
      }
    }
  } catch (error) {
    console.error('更新失败:', error);
    showError('更新失败，请检查网络连接');
  }
}

// 删除待办事项
async function deleteTodo(id) {
  if (!confirm('确定要删除这个待办事项吗？')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('删除成功');
      loadTodos(); // 重新加载列表
    } else {
      showError('删除失败');
    }
  } catch (error) {
    console.error('删除失败:', error);
    showError('删除失败，请检查网络连接');
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 如果是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getFullYear() === yesterday.getFullYear()) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 其他日期
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// 显示加载状态
function showLoading() {
  // 移除现有的加载指示器
  hideLoading();
  
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-indicator';
  loadingDiv.id = 'loadingIndicator';
  loadingDiv.innerHTML = '<div class="loading-spinner"></div><span>加载中...</span>';
  
  const todoList = document.getElementById('todoList');
  todoList.parentNode.insertBefore(loadingDiv, todoList);
}

// 隐藏加载状态
function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

// 显示错误消息
function showError(message) {
  // 移除现有的消息
  removeMessages();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <span class="message-text">${message}</span>
    <button class="message-close" onclick="this.parentElement.remove()">×</button>
  `;
  errorDiv.style.display = 'flex';
  
  const main = document.querySelector('main');
  main.insertBefore(errorDiv, main.firstChild);
  
  // 5秒后自动隐藏
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }
  }, 5000);
}

// 显示成功消息
function showSuccess(message) {
  // 移除现有的消息
  removeMessages();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <span class="message-text">${message}</span>
    <button class="message-close" onclick="this.parentElement.remove()">×</button>
  `;
  successDiv.style.display = 'flex';
  
  const main = document.querySelector('main');
  main.insertBefore(successDiv, main.firstChild);
  
  // 3秒后自动隐藏
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }
  }, 3000);
}

// 移除所有消息
function removeMessages() {
  const messages = document.querySelectorAll('.error-message, .success-message');
  messages.forEach(msg => msg.remove());
}
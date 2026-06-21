// 统一错误处理中间件
function errorHandler(err, req, res, next) {
  console.error('服务器错误:', err);
  
  // 默认错误状态码
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// 请求验证中间件
function validateTodoRequest(req, res, next) {
  if (req.method === 'POST') {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '标题不能为空'
      });
    }
    // 清理输入
    req.body.title = title.trim();
  }
  next();
}

// 异步路由包装器
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  validateTodoRequest,
  asyncHandler
};
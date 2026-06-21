# API 接口文档

## 基础信息

- **基础URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 接口列表

### 1. 健康检查

**请求**
```
GET /api/health
```

**响应**
```json
{
  "status": "OK",
  "timestamp": "2026-06-22T10:00:00.000Z",
  "message": "服务器运行正常"
}
```

**状态码**
- `200`: 成功

---

### 2. 获取待办事项列表

**请求**
```
GET /api/todos?page=1&limit=100
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| limit | number | 否 | 每页数量，默认为100 |

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "学习Node.js",
      "completed": false,
      "created_at": "2026-06-22 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 50,
    "totalPages": 1
  }
}
```

**状态码**
- `200`: 成功
- `500`: 服务器错误

---

### 3. 获取单个待办事项

**请求**
```
GET /api/todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项ID |

**响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "学习Node.js",
    "completed": false,
    "created_at": "2026-06-22 10:00:00"
  }
}
```

**状态码**
- `200`: 成功
- `404`: 待办事项不存在
- `500`: 服务器错误

---

### 4. 添加待办事项

**请求**
```
POST /api/todos
```

**请求体**
```json
{
  "title": "学习Express框架"
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 待办事项标题，不能为空 |

**响应**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "学习Express框架",
    "completed": false,
    "created_at": "2026-06-22 10:05:00"
  }
}
```

**状态码**
- `201`: 创建成功
- `400`: 请求参数错误（标题为空）
- `500`: 服务器错误

---

### 5. 更新待办事项状态

**请求**
```
PUT /api/todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项ID |

**请求体**
```json
{
  "completed": true
}
```

**字段说明**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| completed | boolean | 是 | 完成状态 |

**响应**
```json
{
  "success": true,
  "message": "更新成功"
}
```

**状态码**
- `200`: 更新成功
- `500`: 服务器错误

---

### 6. 删除待办事项

**请求**
```
DELETE /api/todos/:id
```

**路径参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 待办事项ID |

**响应**
```json
{
  "success": true,
  "message": "删除成功"
}
```

**状态码**
- `200`: 删除成功
- `500`: 服务器错误

---

## 错误响应格式

所有错误响应都遵循以下格式：

```json
{
  "success": false,
  "message": "错误信息"
}
```

## 示例代码

### JavaScript (Fetch API)

```javascript
// 获取所有待办事项
const response = await fetch('/api/todos');
const data = await response.json();

// 添加待办事项
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title: '新待办事项' })
});

// 更新待办事项状态
const response = await fetch('/api/todos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ completed: true })
});

// 删除待办事项
const response = await fetch('/api/todos/1', {
  method: 'DELETE'
});
```

### cURL

```bash
# 获取所有待办事项
curl http://localhost:3000/api/todos

# 添加待办事项
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "新待办事项"}'

# 更新待办事项状态
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 删除待办事项
curl -X DELETE http://localhost:3000/api/todos/1
```

## 注意事项

1. 所有请求和响应都使用JSON格式
2. 标题字段不能为空字符串
3. ID字段为自增整数
4. 时间字段使用ISO 8601格式
5. 分页参数page从1开始，limit最大为1000
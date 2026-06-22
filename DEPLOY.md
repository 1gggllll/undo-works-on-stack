# 部署指南

## 部署平台选择

| 平台 | 免费额度 | SQLite支持 | 难度 |
|------|----------|------------|------|
| Railway | 有 | ✅ | 简单 |
| Render | 有 | ✅ | 简单 |
| Heroku | 无 | ❌ | 中等 |
| Vercel | 有 | ❌ | 简单 |

**推荐使用 Railway 或 Render**（支持 SQLite 数据库）

---

## 方案一：Railway 部署（推荐）

### 步骤

1. 访问 [Railway](https://railway.app) 并注册账号

2. 点击 "New Project" → "Deploy from GitHub repo"

3. 选择你的仓库，Railway 会自动检测 Node.js 项目

4. 配置环境变量：
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

5. 点击 "Deploy"，等待部署完成

6. 部署成功后，Railway 会提供一个公网域名

---

## 方案二：Render 部署

### 步骤

1. 访问 [Render](https://render.com) 并注册账号

2. 点击 "New" → "Web Service"

3. 连接 GitHub 仓库

4. 配置：
   - **Name**: todo-app
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. 添加环境变量：
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

6. 点击 "Create Web Service"

---

## 方案三：Docker 部署

### 本地运行

```bash
# 构建镜像
docker build -t todo-app .

# 运行容器
docker run -p 3000:3000 -d todo-app
```

### Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

运行：`docker-compose up -d`

---

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DB_PATH | 数据库文件路径 | ./todos.db |

---

## 部署后验证

1. 访问 `https://你的域名` 查看前端页面
2. 访问 `https://你的域名/api/health` 检查 API 状态
3. 测试添加、删除、更新待办事项功能

---

## 常见问题

### Q: SQLite 数据库文件丢失？
A: SQLite 文件存储在容器内，重启会丢失。建议：
- 使用 Railway/Render 的持久化存储
- 或迁移到 PostgreSQL/MySQL

### Q: 部署后无法访问？
A: 检查：
- 端口配置是否正确
- 环境变量是否设置
- 服务器日志是否有错误

### Q: 如何配置自定义域名？
A: 在部署平台的设置中添加自定义域名，并配置 DNS 解析

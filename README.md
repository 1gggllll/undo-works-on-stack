# 全栈待办事项列表应用

一个用于学生实践的全栈Web应用，实现待办事项的增删改查功能。本项目涵盖前端、后端和数据库的完整开发流程，帮助理解现代Web应用架构。

## 项目简

本项目是一个简单但功能完整的待办事项列表应用，采用前后端分离架构。用户可以通过网页界面添加、编辑、完成和删除待办事项，所有数据都会持久化存储到数据库中。

## 技术栈

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式设计与响应式布局
- **原生JavaScript** - 交互逻辑与API调用

### 后端
- **Node.js** - 运行环境
- **Express.js** - Web框架
- **SQLite3** - 轻量级数据库

### 开发工具
- **npm** - 包管理器
- **Git** - 版本控制
- **Postman**（可选） - API测试

## 功能特性

### 核心功能
1. **添加待办事项** - 输入标题创建新的待办事项
2. **查看待办列表** - 显示所有待办事项及其状态
3. **标记完成/未完成** - 切换待办事项的完成状态
4. **删除待办事项** - 移除不需要的待办事项
5. **编辑待办事项**（可选） - 修改待办事项标题

### 数据特性
- 数据持久化存储到SQLite数据库
- 自动记录创建时间
- 支持完成状态标记

### 用户体验
- 响应式设计，支持移动端访问
- 实时反馈操作结果
- 友好的错误提示

## 安装与运行

### 环境要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本
- Git（可选）

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/1gggllll/undo-works-on-stack.git
cd undo-works-on-stack
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
node server.js
```

4. **访问应用**
打开浏览器访问：`http://localhost:3000`

### 开发模式
```bash
# 使用nodemon自动重启（需要先安装）
npm install -g nodemon
nodemon server.js
```

## API接口文档

### 基础URL
```
http://localhost:3000/api
```

### 接口列表

#### 1. 获取所有待办事项
- **URL**: `/todos`
- **方法**: `GET`
- **响应示例**:
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
  ]
}
```

#### 2. 添加新待办事项
- **URL**: `/todos`
- **方法**: `POST`
- **请求体**:
```json
{
  "title": "学习Express框架"
}
```
- **响应示例**:
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

#### 3. 更新待办事项状态
- **URL**: `/todos/:id`
- **方法**: `PUT`
- **请求体**:
```json
{
  "completed": true
}
```
- **响应示例**:
```json
{
  "success": true,
  "message": "更新成功"
}
```

#### 4. 删除待办事项
- **URL**: `/todos/:id`
- **方法**: `DELETE`
- **响应示例**:
```json
{
  "success": true,
  "message": "删除成功"
}
```

#### 5. 健康检查
- **URL**: `/health`
- **方法**: `GET`
- **响应示例**:
```json
{
  "status": "OK",
  "timestamp": "2026-06-22T10:00:00.000Z"
}
```

## 项目结构

```
train_one/
├── README.md               # 项目说明文档
├── package.json            # Node.js项目配置
├── server.js               # Express服务器入口
├── database.js             # 数据库初始化与操作
├── middleware.js            # 中间件（错误处理、验证）
├── test/                   # 测试文件
│   └── api.test.js         # API接口测试
├── public/                 # 静态前端文件
│   ├── index.html          # 主页面
│   ├── style.css           # 样式文件
│   └── script.js           # 前端逻辑
├── todos.db                # SQLite数据库文件（自动生成）
└── .gitignore              # Git忽略文件配置
```

## 数据库设计

### 表结构
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明
- `id`: 主键，自增整数
- `title`: 待办事项标题，不能为空
- `completed`: 完成状态，0表示未完成，1表示已完成
- `created_at`: 创建时间，自动记录

## 开发指南

### 代码规范
- 使用2空格缩进
- 使用单引号字符串
- 函数和变量使用驼峰命名
- 添加必要的注释

### 提交规范
使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具变动

### 开发流程
1. 在`dev`分支上开发新功能
2. 完成功能后提交并推送到远程`dev`分支
3. 测试无误后合并到`main`分支
4. 推送`main`分支到远程仓库

## 扩展功能

### 已规划扩展
1. **用户认证** - 添加登录注册功能
2. **分类管理** - 支持待办事项分类
3. **优先级设置** - 支持设置优先级（高、中、低）
4. **截止日期** - 支持设置截止时间
5. **搜索功能** - 支持按标题搜索

### 技术扩展
1. **前端框架** - 使用React或Vue.js重构前端
2. **数据库升级** - 迁移到MySQL或PostgreSQL
3. **部署优化** - 使用Docker容器化部署
4. **缓存优化** - 添加Redis缓存
5. **API文档** - 使用Swagger生成API文档

## 部署说明

### 本地部署
项目默认运行在3000端口，可通过环境变量修改：
```bash
PORT=8080 node server.js
```

### 云平台部署（示例）

#### Heroku部署
1. 创建Heroku账户
2. 安装Heroku CLI
3. 登录并创建应用
4. 推送代码到Heroku

#### Vercel部署
1. 连接GitHub仓库
2. 配置构建设置
3. 自动部署

### 环境变量配置
创建`.env`文件：
```
PORT=3000
NODE_ENV=production
```
## 学习资源

### 官方文档
- [Express.js文档](https://expressjs.com/)
- [SQLite文档](https://www.sqlite.org/docs.html)
- [Node.js文档](https://nodejs.org/en/docs/)

### 学习网站
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3Schools](https://www.w3schools.com/)
- [Stack Overflow](https://stackoverflow.com/)


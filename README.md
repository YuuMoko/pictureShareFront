# 图片分享平台

基于 Vue 3 的图片分享平台前端应用，支持用户注册、登录、图片上传、下载、展示和删除功能。

## 功能特性

- ✅ 用户注册和登录
- ✅ 图片上传（支持拖拽和点击上传，支持多张图片）
- ✅ 图片展示（网格布局，响应式设计）
- ✅ 图片下载
- ✅ 图片删除
- ✅ 路由守卫（未登录自动跳转登录页）
- ✅ 状态管理（使用 Pinia）
- ✅ 美观的 UI 设计

## 技术栈

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)
- Axios (HTTP 请求)
- Vite (构建工具)

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── views/          # 页面组件
│   ├── Login.vue   # 登录页
│   ├── Register.vue # 注册页
│   └── Images.vue  # 图片管理页
├── stores/         # Pinia 状态管理
│   └── auth.js     # 认证状态
├── services/       # API 服务
│   ├── api.js      # Axios 配置
│   └── imageService.js # 图片服务
├── router/         # 路由配置
│   └── index.js
├── App.vue         # 根组件
├── main.js         # 入口文件
└── style.css       # 全局样式
```

## API 接口说明

项目需要后端提供以下 API 接口：

### 认证接口

- `POST /api/auth/register` - 用户注册
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - 用户登录
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 图片接口

- `GET /api/images` - 获取图片列表
- `POST /api/images/upload` - 上传图片（multipart/form-data）
- `DELETE /api/images/:id` - 删除图片

## 环境变量

创建 `.env` 文件配置 API 基础地址：

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 注意事项

1. 本项目为前端应用，需要配合后端 API 使用
2. Token 存储在 localStorage 中
3. 图片上传支持拖拽和点击两种方式
4. 支持多张图片同时上传

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)


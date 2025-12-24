# 项目结构

```
007.小野 AI甄选-网页端/
├── public/                 # 静态文件目录（部署到 Vercel）
│   ├── index.html         # 首页
│   ├── detail.html        # 详情页
│   ├── styles.css         # 样式文件
│   ├── script.js          # 前端逻辑
│   ├── favicon.svg        # 网站图标
│   ├── test.html          # 资源测试页
│   └── diagnostic.html    # 诊断工具页
│
├── routes/                # API 路由
│   ├── contents.js        # 内容接口
│   ├── categories.js      # 分类接口
│   └── proxy.js           # 图片代理接口
│
├── services/              # 业务逻辑层
│   └── feishuService.js   # 飞书服务
│
├── utils/                 # 工具函数
│   └── errorHandler.js    # 错误处理
│
├── config/                # 配置文件
│   └── feishu.js          # 飞书配置
│
├── server.js              # Express 服务器入口
├── vercel.json            # Vercel 部署配置
├── package.json           # 项目依赖
├── .env.example           # 环境变量示例
├── .gitignore             # Git 忽略文件
├── .vercelignore          # Vercel 忽略文件
├── README.md              # 项目说明
├── DEPLOYMENT.md          # 部署指南
└── PRD.MD                 # 产品需求文档
```

## 目录说明

### `public/` - 静态文件
所有前端静态资源都放在这个目录，Vercel 会自动将其作为静态文件服务。

### `routes/` - API 路由
- **contents.js**: 处理内容列表和详情的 API
- **categories.js**: 处理分类相关的 API
- **proxy.js**: 代理飞书图片，解决跨域问题

### `services/` - 业务逻辑
- **feishuService.js**: 封装飞书多维表格的数据获取和字段映射逻辑

### `utils/` - 工具函数
- **errorHandler.js**: 统一的错误处理中间件

### 配置文件
- **server.js**: Express 应用的主入口，注册路由和中间件
- **vercel.json**: Vercel 部署配置，定义构建和路由规则
- **.env**: 环境变量（不提交到 Git）
- **.env.example**: 环境变量模板

## 部署架构

```
用户请求
    ↓
Vercel CDN
    ↓
    ├─→ /api/*  → server.js (Serverless Function)
    │              ↓
    │          飞书多维表格 API
    │
    └─→ /*      → public/ (静态文件)
```

## 数据流

1. 用户访问网站 → Vercel 返回 `public/index.html`
2. 浏览器加载 `public/script.js`
3. JavaScript 调用 `/api/contents` 获取数据
4. server.js 从飞书多维表格获取数据
5. 数据缓存 5 分钟，减少 API 调用
6. 返回 JSON 数据给前端
7. 前端渲染内容卡片

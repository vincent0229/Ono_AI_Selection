# 小野 AI 甄选 - 网页端

AI 领域最新洞察,用孩子们能听懂的语言呈现。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的飞书配置

# 启动服务器
npm start

# 访问 http://localhost:3000
```

### Vercel 部署

#### ✅ 已修复的问题

如果你的网站在 Vercel 上显示所有内容挤在一起（没有样式），这个问题已经修复！

**修复内容:**
1. ✅ 修复了 `vercel.json` 中的路由配置错误
2. ✅ 移除了多余的转义字符
3. ✅ 优化了静态资源加载顺序

#### 部署步骤

1. **推送代码到 Git**
   ```bash
   git add .
   git commit -m "fix: 修复 Vercel 部署配置"
   git push
   ```

2. **在 Vercel 控制台配置环境变量**
   
   进入项目设置 → Environment Variables，添加:
   ```
   FEISHU_APP_ID=你的飞书应用ID
   FEISHU_APP_SECRET=你的飞书应用密钥
   FEISHU_APP_TOKEN=你的飞书多维表格Token
   FEISHU_TABLE_ID=你的飞书表格ID
   NODE_ENV=production
   CACHE_DURATION=300000
   ```

3. **重新部署**
   
   在 Vercel 控制台点击 "Redeploy" 或推送新的提交

#### 🔍 诊断工具

部署后访问 `https://你的域名/diagnostic.html` 可以自动检测:
- ✅ CSS 文件是否正确加载
- ✅ JavaScript 文件是否正确加载
- ✅ API 是否正常工作
- ✅ 环境变量是否配置正确
- ✅ 内容数据是否能正常获取

#### 常见问题

**Q: 页面显示"加载中..."不消失**

A: 打开浏览器开发者工具 (F12)，检查:
1. Console 标签是否有错误
2. Network 标签中 `/api/contents` 请求是否成功
3. 确认 Vercel 环境变量是否正确配置

**Q: CSS 样式没有生效**

A: 
1. 确认已更新到最新的 `vercel.json` 配置
2. 清除浏览器缓存 (Ctrl+Shift+R)
3. 访问 `/diagnostic.html` 检查 CSS 加载状态

**Q: 如何查看服务器日志**

A: Vercel 控制台 → Deployments → 选择最新部署 → View Function Logs

## 📁 项目结构

```
├── index.html          # 首页
├── detail.html         # 详情页
├── diagnostic.html     # 诊断工具
├── styles.css          # 样式文件
├── script.js           # 前端逻辑
├── server.js           # 服务器入口
├── vercel.json         # Vercel 配置
├── routes/             # API 路由
│   ├── contents.js     # 内容接口
│   ├── categories.js   # 分类接口
│   └── proxy.js        # 图片代理
├── services/           # 业务逻辑
│   └── feishuService.js # 飞书服务
└── utils/              # 工具函数
    └── errorHandler.js # 错误处理
```

## 📚 更多文档

- [详细部署指南](./DEPLOYMENT.md)
- [产品需求文档](./PRD.MD)

## 🛠️ 技术栈

- **前端**: HTML, CSS, JavaScript (原生)
- **后端**: Node.js, Express
- **数据源**: 飞书多维表格
- **部署**: Vercel

## 📝 License

MIT

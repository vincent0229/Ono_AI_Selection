/**
 * 小野 AI 甄选 - 服务器主入口
 * 重构后的简洁版本
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 导入路由
const contentsRouter = require('./routes/contents');
const categoriesRouter = require('./routes/categories');
const proxyRouter = require('./routes/proxy');

// 导入错误处理
const { errorHandler } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 注册路由
app.use('/api/contents', contentsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api', proxyRouter);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// 错误处理中间件（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   小野 AI 甄选 - 服务器已启动                              ║
║                                                           ║
║   本地访问: http://localhost:${PORT}                        ║
║   环境: ${process.env.NODE_ENV || 'development'}                                      ║
║                                                           ║
║   飞书多维表格已连接                                       ║
║   缓存时长: ${process.env.CACHE_DURATION / 60000 || 5} 分钟                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;

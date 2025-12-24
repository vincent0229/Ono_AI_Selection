# Vercel 部署指南

## 问题诊断

如果你的网站在 Vercel 上显示所有内容挤在一起，通常是以下原因:

1. ✅ **CSS 文件未加载** - 已修复 `vercel.json` 配置
2. ⚠️ **环境变量未配置** - 需要在 Vercel 控制台配置
3. ⚠️ **API 调用失败** - 检查飞书 API 配置

## 部署步骤

### 1. 修复配置文件

已经修复了 `vercel.json` 文件中的路由配置问题。

### 2. 在 Vercel 控制台配置环境变量

登录 Vercel 控制台，进入你的项目设置，添加以下环境变量:

```
FEISHU_APP_ID=你的飞书应用ID
FEISHU_APP_SECRET=你的飞书应用密钥
FEISHU_APP_TOKEN=你的飞书多维表格Token
FEISHU_TABLE_ID=你的飞书表格ID
NODE_ENV=production
CACHE_DURATION=300000
```

### 3. 重新部署

配置完环境变量后，重新部署项目:

```bash
git add .
git commit -m "fix: 修复 Vercel 部署配置"
git push
```

或者在 Vercel 控制台手动触发重新部署。

### 4. 验证部署

部署完成后，检查以下内容:

1. **CSS 是否加载**: 打开浏览器开发者工具 (F12)，查看 Network 标签，确认 `styles.css` 返回 200 状态码
2. **JS 是否加载**: 确认 `script.js` 返回 200 状态码
3. **API 是否正常**: 访问 `https://你的域名/api/health` 应该返回 JSON 数据
4. **内容是否加载**: 访问 `https://你的域名/api/contents` 应该返回内容列表

## 常见问题

### Q: 页面显示"加载中..."不消失

**原因**: API 调用失败，JavaScript 无法获取数据

**解决方案**:
1. 检查浏览器控制台 (F12 → Console) 是否有错误信息
2. 检查 Network 标签，查看 `/api/contents` 请求是否成功
3. 确认 Vercel 环境变量是否正确配置
4. 查看 Vercel 部署日志是否有错误

### Q: CSS 样式没有生效

**原因**: 静态文件路由配置错误

**解决方案**:
1. 确认 `vercel.json` 已更新为最新版本
2. 重新部署项目
3. 清除浏览器缓存 (Ctrl+Shift+R 或 Cmd+Shift+R)

### Q: 图片无法显示

**原因**: 飞书图片需要通过代理访问

**解决方案**:
- 代码已经处理了飞书图片代理，确保 `/api/image-proxy` 路由正常工作

## 本地测试

在部署前，建议先在本地测试:

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 访问 http://localhost:3000
```

确保本地运行正常后再部署到 Vercel。

## 调试技巧

### 查看 Vercel 日志

1. 登录 Vercel 控制台
2. 进入你的项目
3. 点击 "Deployments"
4. 选择最新的部署
5. 点击 "View Function Logs" 查看服务器日志

### 浏览器调试

1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的网络请求
4. 查看 Elements 标签确认 HTML 结构是否正确

## 联系支持

如果问题仍然存在，请提供:
1. Vercel 部署 URL
2. 浏览器控制台截图
3. Network 标签截图
4. Vercel 函数日志

# 小野 AI 甄选内容平台项目 PRD

## 1. 项目概述

### 1.1 项目背景
实现一个AI精选内容平台，帮助用户从海量信息中过滤噪音，5分钟获取优质访谈里的深度洞察。

### 1.2 核心功能
- 内容列表展示
- 分类筛选
- 搜索功能
- 内容详情查看
- 响应式设计

### 1.3 数据来源
飞书多维表格，表头从左到右分别为：标题、原标题、频道、发布日期、视频时长、封面、URL、状态、文章主体、精彩金句、嘉宾、关键洞察

## 2. 网站结构

### 2.1 整体架构
```
首页
├── 导航栏
│   ├── Logo
│   ├── 搜索框
│   └── 分类标签
├── 内容列表
│   ├── 内容卡片（多张）
│   └── 分页（可选）
└── 页脚
```

### 2.2 页面组成

#### 2.2.1 导航栏
- Logo："小野 AI 甄选"文字标识
- 搜索框：支持搜索内容、金句、嘉宾等
- 分类标签：All、New、AI Coding、AI Products、AI Organization、AI Business、AI Principles、Personal Productivity、Physical AI

#### 2.2.2 内容列表
- 以卡片形式展示内容
- 每张卡片包含：封面图、分类、发布日期、标题、嘉宾、精彩金句预览

#### 2.2.3 内容详情页
- 完整标题
- 嘉宾信息
- 发布日期
- 分类标签
- 封面图
- 视频/音频链接
- 文章主体
- 精彩金句
- 关键洞察

## 3. 页面设计与功能

### 3.1 设计风格
- 简约现代风格
- 主色调：蓝色系
- 排版清晰，重点突出
- 响应式设计，适配不同设备

### 3.2 首页设计

#### 3.2.1 顶部区域
- Logo：左侧显示"小野 AI 甄选"文字
- 搜索框：居中，带有占位符文字
- 分类标签：水平排列，支持点击筛选

#### 3.2.2 内容卡片设计
- 卡片布局：图片在上，文字在下
- 图片：比例约为16:9，显示内容封面
- 文字区域：
  - 分类标签：左上角显示，如"AI Business"
  - 发布日期：右上角显示，如"2025年12月23日"
  - 标题：加粗显示，点击可进入详情页
  - 嘉宾：显示嘉宾名称
  - 精彩金句：引用格式，显示部分内容

### 3.3 功能实现

#### 3.3.1 分类筛选
- 点击分类标签，过滤显示对应分类的内容
- 当前选中分类高亮显示

#### 3.3.2 搜索功能
- 支持关键词搜索
- 搜索范围包括：标题、嘉宾、精彩金句、关键洞察

#### 3.3.3 响应式设计
- 桌面端：多列布局（3-4列）
- 平板端：2列布局
- 移动端：1列布局

## 4. 数据模型

### 4.1 飞书多维表格字段映射

| 飞书多维表格字段 | 网站展示字段 | 数据类型 | 说明 |
|----------------|-------------|---------|------|
| 标题 | 标题 | 字符串 | 内容的主标题，显示在卡片和详情页 |
| 原标题 | 原标题 | 字符串 | 内容的原始标题，可选显示 |
| 频道 | 分类标签 | 字符串 | 内容所属分类，如"AI Business" |
| 发布日期 | 发布日期 | 日期 | 内容发布时间，格式：2025年12月23日 |
| 视频时长 | 视频时长 | 字符串 | 如"15:30"，显示在封面图上 |
| 封面 | 封面图 | URL | 内容的封面图片链接 |
| URL | 内容链接 | URL | 原始内容的外部链接（如YouTube、小宇宙） |
| 状态 | 状态 | 字符串 | 内容状态（如"已发布"、"草稿"） |
| 文章主体 | 文章主体 | 富文本 | 内容的完整文本 |
| 精彩金句 | 精彩金句 | 字符串 | 内容中的亮点句子，显示在卡片上 |
| 嘉宾 | 嘉宾 | 字符串 | 内容的主讲嘉宾 |
| 关键洞察 | 关键洞察 | 字符串 | 内容的核心观点和洞察 |

### 4.2 数据处理
- 日期格式化：将飞书日期转换为"2025年12月23日"格式
- 分类标签：提取唯一分类值，用于生成导航标签
- 内容排序：默认按发布日期降序排列

## 5. 技术实现方案

### 5.1 前端技术栈
- HTML5 + CSS3 + JavaScript
- 使用现代CSS布局：Grid + Flexbox
- 响应式设计：媒体查询
- 无需复杂框架，保持轻量

### 5.2 数据接入方案

#### 5.2.1 飞书多维表格API
- 使用飞书开放平台API获取多维表格数据
- 需要配置飞书应用，获取App ID和App Secret
- API文档参考：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/overview

#### 5.2.2 数据获取流程
1. 前端发起请求到中间层（或直接请求飞书API，需要处理跨域）
2. 中间层调用飞书API获取多维表格数据
3. 数据处理和格式化
4. 返回JSON格式数据给前端
5. 前端渲染页面

### 5.3 页面结构实现

#### 5.3.1 HTML结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>小野 AI 甄选 - AI精选内容平台</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">小野 AI 甄选</div>
            <div class="search-box">
                <input type="text" placeholder="搜索 AI 行业洞察、金句、嘉宾...">
            </div>
            <div class="nav-links">
                <a href="#" class="active">All</a>
                <a href="#">New</a>
                <a href="#">AI Coding</a>
                <a href="#">AI Products</a>
                <a href="#">AI Organization</a>
                <a href="#">AI Business</a>
                <a href="#">AI Principles</a>
                <a href="#">Personal Productivity</a>
                <a href="#">Physical AI</a>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="hero">
                <h1>小野 AI 甄选</h1>
                <p>把 AI 领域的最新洞察<br>用孩子们能听懂的语言呈现出来</p>
                <div class="search-box search-box-large">
                    <input type="text" placeholder="搜索 AI 行业洞察、金句、嘉宾...">
                </div>
            </div>

            <div class="category-filter">
                <a href="#" class="active">All</a>
                <a href="#">New</a>
                <a href="#">AI Coding</a>
                <a href="#">AI Products</a>
                <a href="#">AI Organization</a>
                <a href="#">AI Business</a>
                <a href="#">AI Principles</a>
                <a href="#">Personal Productivity</a>
                <a href="#">Physical AI</a>
            </div>

            <div class="content-grid" id="contentGrid">
                <!-- 内容卡片将通过JavaScript动态生成 -->
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>© 2025 小野 AI 甄选 - AI精选内容平台</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

#### 5.3.2 CSS样式
```css
/* 全局样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 导航栏样式 */
.header {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #007aff;
}

.search-box {
    position: relative;
    width: 300px;
}

.search-box input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 14px;
}

.nav-links {
    display: flex;
    gap: 20px;
}

.nav-links a {
    text-decoration: none;
    color: #666;
    font-size: 14px;
    transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
    color: #007aff;
}

/* 主内容样式 */
.main {
    padding: 40px 0;
}

.hero {
    text-align: center;
    margin-bottom: 40px;
}

.hero h1 {
    font-size: 48px;
    font-weight: bold;
    color: #007aff;
    margin-bottom: 10px;
}

.hero p {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
}

.search-box-large {
    width: 500px;
    margin: 0 auto;
}

.search-box-large input {
    padding: 12px 20px;
    font-size: 16px;
}

/* 分类筛选样式 */
.category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
}

.category-filter a {
    padding: 6px 16px;
    background-color: #e0e0e0;
    color: #666;
    text-decoration: none;
    border-radius: 20px;
    font-size: 14px;
    transition: all 0.3s;
}

.category-filter a:hover,
.category-filter a.active {
    background-color: #007aff;
    color: #fff;
}

/* 内容网格样式 */
.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.content-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.content-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.content-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.content-card .card-content {
    padding: 20px;
}

.content-card .category {
    display: inline-block;
    padding: 4px 12px;
    background-color: #f0f0f0;
    color: #666;
    font-size: 12px;
    border-radius: 12px;
    margin-bottom: 10px;
}

.content-card .date {
    float: right;
    font-size: 12px;
    color: #999;
}

.content-card h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.content-card .guest {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
}

.content-card .quote {
    font-size: 14px;
    color: #666;
    font-style: italic;
    line-height: 1.5;
}

/* 页脚样式 */
.footer {
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        gap: 20px;
    }

    .search-box {
        width: 100%;
    }

    .nav-links {
        flex-wrap: wrap;
        justify-content: center;
    }

    .hero h1 {
        font-size: 36px;
    }

    .search-box-large {
        width: 100%;
    }

    .content-grid {
        grid-template-columns: 1fr;
    }
}
```

#### 5.3.3 JavaScript实现
```javascript
// 飞书多维表格数据获取和页面渲染
class ContentPlatform {
    constructor() {
        this.contentGrid = document.getElementById('contentGrid');
        this.categoryFilter = document.querySelector('.category-filter');
        this.currentCategory = 'All';
        this.allContent = [];
        this.init();
    }

    async init() {
        await this.fetchData();
        this.renderContent();
        this.bindEvents();
    }

    async fetchData() {
        // 模拟从飞书多维表格获取数据
        // 实际项目中应替换为真实的API调用
        try {
            // 飞书API调用示例
            // const response = await fetch('your-api-endpoint/feishu-data');
            // this.allContent = await response.json();
            
            // 模拟数据
            this.allContent = [
                {
                    "标题": "红杉郑庆生：用\"流量\"解构20年经济史，AI时代的深层次数字化与华人新航海",
                    "原标题": "红杉郑庆生访谈",
                    "频道": "AI Business",
                    "发布日期": "2025年12月23日",
                    "视频时长": "45:30",
                    "封面": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                    "URL": "https://www.youtube.com/watch?v=example1",
                    "状态": "已发布",
                    "文章主体": "完整文章内容...",
                    "精彩金句": "在我看来所有的人类的历史，它本质上是一种某种程度的流量……",
                    "嘉宾": "郑庆生",
                    "关键洞察": "流量经济的本质及AI时代的数字化转型"
                },
                {
                    "标题": "你可以修复Bug，却无法修复大脑：揭秘AI安全护栏为何形同虚设",
                    "原标题": "AI安全护栏访谈",
                    "频道": "AI Principles",
                    "发布日期": "2025年12月21日",
                    "视频时长": "38:45",
                    "封面": "https://img.youtube.com/vi/J9982NLmTXg/maxresdefault.jpg",
                    "URL": "https://www.youtube.com/watch?v=example2",
                    "状态": "已发布",
                    "文章主体": "完整文章内容...",
                    "精彩金句": "AI guardrails do not work. I'm gonna say that one more time. Guardrails do not work...",
                    "嘉宾": "Sander Schulhoff",
                    "关键洞察": "AI安全护栏的局限性"
                }
                // 更多内容...
            ];
        } catch (error) {
            console.error('获取数据失败:', error);
        }
    }

    renderContent() {
        const filteredContent = this.currentCategory === 'All' 
            ? this.allContent 
            : this.allContent.filter(item => item.频道 === this.currentCategory);

        this.contentGrid.innerHTML = '';

        filteredContent.forEach(item => {
            const card = this.createContentCard(item);
            this.contentGrid.appendChild(card);
        });
    }

    createContentCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <img src="${item.封面}" alt="${item.标题}">
            <div class="card-content">
                <span class="category">${item.频道}</span>
                <span class="date">${item.发布日期}</span>
                <h3>${item.标题}</h3>
                <div class="guest">👤 ${item.嘉宾}</div>
                <div class="quote">"${item.精彩金句}"</div>
            </div>
        `;
        return card;
    }

    bindEvents() {
        // 分类筛选事件
        this.categoryFilter.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                
                // 移除所有active类
                this.categoryFilter.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                });
                
                // 添加当前active类
                e.target.classList.add('active');
                
                // 更新当前分类并重新渲染
                this.currentCategory = e.target.textContent;
                this.renderContent();
            }
        });

        // 搜索功能
        const searchInput = document.querySelector('.search-box-large input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.searchContent(searchTerm);
        });
    }

    searchContent(searchTerm) {
        let filteredContent = this.allContent;
        
        if (searchTerm) {
            filteredContent = this.allContent.filter(item => {
                return item.标题.toLowerCase().includes(searchTerm) ||
                       item.嘉宾.toLowerCase().includes(searchTerm) ||
                       item.精彩金句.toLowerCase().includes(searchTerm) ||
                       item.关键洞察.toLowerCase().includes(searchTerm);
            });
        }

        this.contentGrid.innerHTML = '';
        filteredContent.forEach(item => {
            const card = this.createContentCard(item);
            this.contentGrid.appendChild(card);
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ContentPlatform();
});
```

## 6. 飞书多维表格接入方案

### 6.1 飞书开放平台配置
1. 登录飞书开放平台：https://open.feishu.cn/
2. 创建企业自建应用
3. 配置应用权限：
   - 获取多维表格数据权限
   - 读取表格内容权限
4. 获取App ID和App Secret

### 6.2 API调用示例

```javascript
// 飞书API调用示例
async function fetchFeishuData() {
    // 1. 获取访问令牌
    const tokenResponse = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            app_id: 'YOUR_APP_ID',
            app_secret: 'YOUR_APP_SECRET'
        })
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.app_access_token;
    
    // 2. 获取多维表格数据
    const dataResponse = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps/YOUR_APP_TOKEN/tables/YOUR_TABLE_ID/records/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    const data = await dataResponse.json();
    return data.data.items;
}
```

### 6.3 数据映射与处理
- 将飞书API返回的字段映射到网站所需的字段
- 处理日期格式
- 过滤状态为"已发布"的内容
- 按发布日期排序

## 7. 项目进度规划

| 阶段 | 任务 | 时间 |
|------|------|------|
| 1 | 项目启动与需求分析 | 1天 |
| 2 | 前端页面开发 | 3天 |
| 3 | 飞书API接入 | 2天 |
| 4 | 功能测试与优化 | 2天 |
| 5 | 部署上线 | 1天 |

## 8. 验收标准

1. 页面布局与设计与原网站一致
2. 所有功能正常工作：
   - 分类筛选
   - 搜索功能
   - 响应式设计
3. 数据正确从飞书多维表格加载
4. 页面性能良好，加载速度快
5. 兼容性好，支持主流浏览器

## 9. 后续优化建议

1. 添加分页功能
2. 实现内容详情页
3. 添加用户收藏功能
4. 增加内容分享功能
5. 添加阅读统计功能
6. 优化搜索体验，支持关键词高亮

---

**版本历史：**
- v1.0 (2025-12-23)：初始版本，完成网站PRD设计

**文档作者：** AI助手
**审核：** 待审核
**批准：** 待批准
// 小野 AI 甄选 - 内容平台交互逻辑

// 调试开关 - 生产环境设为 false
const DEBUG = false;

class ContentPlatform {
    constructor() {
        this.contentGrid = document.getElementById('contentGrid');
        this.loadingEl = document.getElementById('loading');
        this.noResultsEl = document.getElementById('noResults');
        this.currentCategory = '';
        this.searchTerm = '';
        this.allContent = [];
        this.filteredContent = [];
        this.init();
    }

    async init() {
        await this.fetchData();
        this.setupEventListeners();
        this.selectFirstAvailableCategory();
        this.applyFilters();
        this.renderContent();
    }

    selectFirstAvailableCategory() {
        const categories = [...new Set(this.allContent.map(item => item.频道))];

        if (categories.length > 0) {
            const firstCat = categories[0];
            const links = document.querySelectorAll('.nav-link, .filter-link');
            let matched = false;

            links.forEach(link => {
                if (link.dataset.category === firstCat) {
                    link.classList.add('active');
                    this.currentCategory = firstCat;
                    matched = true;
                }
            });

            if (!matched) {
                this.currentCategory = '';
            }
        } else {
            this.currentCategory = '';
        }
    }

    async fetchData() {
        this.showLoading(true);

        try {
            // 从后端API获取数据
            const response = await fetch('/api/contents');
            const result = await response.json();

            if (result.code === 0 && result.data.length > 0) {
                this.allContent = result.data;
            } else {
                // 使用模拟数据作为后备
                this.allContent = this.getMockData();
            }

            // 按发布日期降序排序
            this.allContent.sort((a, b) => {
                const dateA = new Date(this.parseDate(a.发布日期));
                const dateB = new Date(this.parseDate(b.发布日期));
                return dateB - dateA;
            });

            // 提取并去重分类标签
            this.updateCategoryTags();

        } catch (error) {
            console.error('获取数据失败:', error);
            // 使用模拟数据
            this.allContent = this.getMockData();
        } finally {
            this.showLoading(false);
        }
    }

    // 获取模拟数据
    getMockData() {
        return [
            {
                "标题": "红杉郑庆生：用\"流量\"解构20年经济史，AI时代的深层次数字化与华人新航海",
                "原标题": "红杉郑庆生访谈",
                "频道": "AI Business",
                "发布日期": "2025-12-23",
                "视频时长": "45:30",
                "封面": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "在我看来所有的人类的历史，它本质上是一种某种程度的流量经济...",
                "嘉宾": "郑庆生",
                "关键洞察": "流量经济的本质及AI时代的数字化转型"
            },
            {
                "标题": "你可以修复Bug，却无法修复大脑：揭秘AI安全护栏为何形同虚设",
                "原标题": "AI安全护栏访谈",
                "频道": "AI Principles",
                "发布日期": "2025-12-21",
                "视频时长": "38:45",
                "封面": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "AI guardrails do not work. I'm gonna say that one more time. Guardrails do not work...",
                "嘉宾": "Sander Schulhoff",
                "关键洞察": "AI安全护栏的局限性"
            },
            {
                "标题": "Claude Code：AI编程助手的全新范式",
                "原标题": "Claude Code发布",
                "频道": "AI Coding",
                "发布日期": "2025-12-20",
                "视频时长": "52:15",
                "封面": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "我们正在重新定义人机协作编程的方式...",
                "嘉宾": "Anthropic团队",
                "关键洞察": "AI编程工具的未来发展方向"
            },
            {
                "标题": "OpenAI o1模型深度解析：推理能力的边界在哪里",
                "原标题": "OpenAI o1分析",
                "频道": "AI Principles",
                "发布日期": "2025-12-18",
                "视频时长": "65:00",
                "封面": "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "推理能力不是线性增长的，而是需要持续的投入和突破...",
                "嘉宾": "OpenAI研究团队",
                "关键洞察": "大语言模型推理能力的发展趋势"
            },
            {
                "标题": "AI产品经理实战：如何打造用户喜爱的AI产品",
                "原标题": "AI产品经理分享",
                "频道": "AI Products",
                "发布日期": "2025-12-16",
                "视频时长": "48:30",
                "封面": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "AI产品的核心不在于技术本身，而在于如何解决用户的真实问题...",
                "嘉宾": "资深AI产品经理",
                "关键洞察": "AI产品设计的方法论和实践经验"
            },
            {
                "标题": "组织变革：AI时代的企业管理新范式",
                "原标题": "AI组织变革",
                "频道": "AI Organization",
                "发布日期": "2025-12-14",
                "视频时长": "55:20",
                "封面": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "未来的组织将不再是层级式的，而是网络式的...",
                "嘉宾": "管理咨询专家",
                "关键洞察": "AI驱动的组织变革趋势"
            },
            {
                "标题": "个人效率革命：AI如何改变我们的工作方式",
                "原标题": "个人AI效率",
                "频道": "Personal Productivity",
                "发布日期": "2025-12-12",
                "视频时长": "42:15",
                "封面": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "AI不是替代我们，而是放大我们的能力...",
                "嘉宾": "效率专家",
                "关键洞察": "AI辅助个人效率提升的实践指南"
            },
            {
                "标题": "具身智能：机器人AI的现在与未来",
                "原标题": "具身智能讨论",
                "频道": "Physical AI",
                "发布日期": "2025-12-10",
                "视频时长": "58:45",
                "封面": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "具身智能是AI从数字世界走向物理世界的关键一步...",
                "嘉宾": "机器人领域专家",
                "关键洞察": "具身智能技术的发展现状和前景"
            },
            {
                "标题": "AI创业公司融资指南：如何打动投资人",
                "原标题": "AI创业融资",
                "频道": "AI Business",
                "发布日期": "2025-12-08",
                "视频时长": "50:30",
                "封面": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "投资人看的不只是技术，更是团队和执行力...",
                "嘉宾": "知名投资人",
                "关键洞察": "AI创业融资的关键要素"
            },
            {
                "标题": "AutoGPT与自主AI代理：技术的边界",
                "原标题": "AutoGPT分析",
                "频道": "AI Coding",
                "发布日期": "2025-12-06",
                "视频时长": "47:20",
                "封面": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "自主代理的挑战不在于让它能做多少事，而在于如何让它安全地做事...",
                "嘉宾": "AI研究员",
                "关键洞察": "自主AI代理技术的发展和挑战"
            },
            {
                "标题": "AI伦理思考：我们应该担心什么",
                "原标题": "AI伦理讨论",
                "频道": "AI Principles",
                "发布日期": "2025-12-04",
                "视频时长": "60:15",
                "封面": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "AI伦理不是技术问题，而是社会问题...",
                "嘉宾": "伦理学专家",
                "关键洞察": "AI伦理的核心议题和思考框架"
            },
            {
                "标题": "AI产品定价策略：如何平衡价值与可及性",
                "原标题": "AI产品定价",
                "频道": "AI Products",
                "发布日期": "2025-12-02",
                "视频时长": "44:00",
                "封面": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
                "URL": "#",
                "状态": "已发布",
                "文章主体": "完整文章内容...",
                "精彩金句": "定价是产品策略的终极表达...",
                "嘉宾": "定价专家",
                "关键洞察": "AI产品定价的策略思考"
            }
        ];
    }

    // 获取占位图
    getPlaceholderImage() {
        return 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
                <rect fill="#e0e0e0" width="800" height="450"/>
                <text fill="#999" font-family="sans-serif" font-size="24" x="50%" y="50%" text-anchor="middle" dy=".3em">暂无封面</text>
            </svg>
        `);
    }

    // 解析日期
    parseDate(dateStr) {
        if (!dateStr) return new Date();
        // 尝试解析 "2025年12月23日" 格式
        const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (match) {
            return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        }
        // 尝试解析 "2025-12-23" 格式
        const match2 = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (match2) {
            return new Date(parseInt(match2[1]), parseInt(match2[2]) - 1, parseInt(match2[3]));
        }
        return new Date(dateStr);
    }

    // 格式化日期
    formatDate(dateStr) {
        const date = this.parseDate(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }

    // 更新分类标签
    updateCategoryTags() {
        // 从数据中提取所有唯一分类
        const categories = new Set(this.allContent.map(item => item.频道));

        // 更新导航链接 - 使用 visible 类控制显示
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const cat = link.dataset.category;
            if (categories.has(cat)) {
                link.classList.add('visible');
            } else {
                link.classList.remove('visible');
            }
        });

        // 更新筛选链接 - 使用 visible 类控制显示
        const filterLinks = document.querySelectorAll('.filter-link');
        filterLinks.forEach(link => {
            const cat = link.dataset.category;
            if (categories.has(cat)) {
                link.classList.add('visible');
            } else {
                link.classList.remove('visible');
            }
        });
    }

    setupEventListeners() {
        // 分类筛选事件
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-link')) {
                e.preventDefault();
                this.handleCategoryClick(e.target);
            }
        });

        // 导航分类点击
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryClick(link);
            });
        });

        // 搜索框输入事件
        const searchBox = document.getElementById('headerSearch');
        searchBox.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.trim();
            this.applyFilters();
        });
    }

    handleCategoryClick(element) {
        // 移除所有active类
        document.querySelectorAll('.nav-link, .filter-link').forEach(el => {
            el.classList.remove('active');
        });

        // 添加active类到当前元素
        element.classList.add('active');

        // 同步另一个区域的对应链接
        const category = element.dataset.category;
        const selector = element.classList.contains('nav-link') ? '.filter-link' : '.nav-link';
        document.querySelectorAll(selector).forEach(el => {
            if (el.dataset.category === category) {
                el.classList.add('active');
            }
        });

        // 更新当前分类
        this.currentCategory = category;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.allContent];

        // 分类筛选
        if (this.currentCategory) {
            filtered = filtered.filter(item => item.频道 === this.currentCategory);
            // 如果没有匹配的数据，显示全部
            if (filtered.length === 0) {
                filtered = [...this.allContent];
            }
        }

        // 搜索关键词筛选（搜索标题、嘉宾、金句、洞察）
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            // 移除空格后的搜索词，用于模糊匹配
            const termNoSpace = term.replace(/\s+/g, '');

            filtered = filtered.filter(item => {
                // 精确匹配（保留空格）
                const titleMatch = item.标题 && item.标题.toLowerCase().includes(term);
                const guestMatch = item.嘉宾 && item.嘉宾.toLowerCase().includes(term);
                const quoteMatch = item.精彩金句 && item.精彩金句.toLowerCase().includes(term);
                const insightMatch = item.关键洞察 && item.关键洞察.toLowerCase().includes(term);

                // 模糊匹配（移除空格后匹配）
                const titleFuzzy = item.标题 && item.标题.toLowerCase().replace(/\s+/g, '').includes(termNoSpace);
                const guestFuzzy = item.嘉宾 && item.嘉宾.toLowerCase().replace(/\s+/g, '').includes(termNoSpace);
                const quoteFuzzy = item.精彩金句 && item.精彩金句.toLowerCase().replace(/\s+/g, '').includes(termNoSpace);
                const insightFuzzy = item.关键洞察 && item.关键洞察.toLowerCase().replace(/\s+/g, '').includes(termNoSpace);

                const matched = titleMatch || guestMatch || quoteMatch || insightMatch ||
                    titleFuzzy || guestFuzzy || quoteFuzzy || insightFuzzy;

                return matched;
            });
        }

        this.filteredContent = filtered;
        this.renderContent();
    }

    renderContent() {
        this.contentGrid.innerHTML = '';

        if (this.filteredContent.length === 0) {
            this.noResultsEl.style.display = 'block';
            return;
        }

        this.noResultsEl.style.display = 'none';

        this.filteredContent.forEach(item => {
            const card = this.createContentCard(item);
            this.contentGrid.appendChild(card);
        });
    }

    createContentCard(item) {
        const card = document.createElement('article');
        card.className = 'content-card';

        let imageUrl = item.封面;
        // 如果是飞书图片URL，使用代理
        if (imageUrl && imageUrl.includes('open.feishu.cn')) {
            imageUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        } else if (!imageUrl) {
            imageUrl = this.getPlaceholderImage();
        }
        const duration = item.视频时长 || '';

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${item.标题}" loading="lazy" onerror="this.src='${this.getPlaceholderImage()}'">
                ${duration ? `<span class="duration-badge">${duration}</span>` : ''}
            </div>
            <div class="card-content">
                <div class="card-header">
                    <span class="category-tag">${item.频道}</span>
                    <span class="card-date">${this.formatDate(item.发布日期)}</span>
                </div>
                <h3 class="card-title">${item.标题}</h3>
                <div class="card-guest">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    ${item.嘉宾}
                </div>
                ${item.精彩金句 ? `<div class="card-quote">${item.精彩金句}</div>` : ''}
            </div>
        `;

        // 点击跳转到详情页
        card.addEventListener('click', () => {
            this.navigateToDetail(item);
        });

        return card;
    }

    navigateToDetail(item) {
        // 将数据存储到sessionStorage以便详情页读取
        sessionStorage.setItem('currentContent', JSON.stringify(item));
        // 跳转到详情页
        window.location.href = `detail.html`;
    }

    showLoading(show) {
        this.loadingEl.style.display = show ? 'block' : 'none';
        if (show) {
            this.noResultsEl.style.display = 'none';
            this.contentGrid.innerHTML = '';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ContentPlatform();
});

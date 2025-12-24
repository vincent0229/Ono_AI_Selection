/**
 * 飞书服务层
 * 负责与飞书 API 交互
 */

const axios = require('axios');
const config = require('../config/feishu');

class FeishuService {
    constructor() {
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * 获取飞书访问令牌（带缓存）
     */
    async getAccessToken() {
        // 如果有缓存且未过期，直接返回
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(
                'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/',
                {
                    app_id: config.appId,
                    app_secret: config.appSecret
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data.code === 0) {
                this.accessToken = response.data.app_access_token;
                // 令牌有效期约2小时，提前5分钟刷新
                this.tokenExpiry = Date.now() + (response.data.expire - 300) * 1000;
                return this.accessToken;
            } else {
                throw new Error(response.data.msg || '获取访问令牌失败');
            }
        } catch (error) {
            console.error('获取访问令牌失败:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * 获取多维表格记录
     */
    async fetchRecords(viewId = null) {
        const accessToken = await this.getAccessToken();

        const response = await axios.get(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records/`,
            {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: {
                    page_size: 100,
                    view_id: viewId || config.viewId
                }
            }
        );

        if (response.data.code === 0) {
            return response.data.data?.items || [];
        } else {
            throw new Error(response.data.msg || '获取记录失败');
        }
    }

    /**
     * 获取单条记录
     */
    async fetchRecord(recordId) {
        const accessToken = await this.getAccessToken();

        const response = await axios.get(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records/${recordId}`,
            {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        );

        if (response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取记录失败');
        }
    }

    /**
     * 获取图片临时下载链接
     */
    async getImageDownloadUrl(fileToken) {
        const accessToken = await this.getAccessToken();

        try {
            const response = await axios.post(
                'https://open.feishu.cn/open-apis/drive/v1/medias/batch_get_tmp_download_url',
                { file_tokens: [fileToken] },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.code === 0) {
                const items = response.data.data?.items;
                if (items && items.length > 0) {
                    return items[0].tmp_download_url;
                }
            }
            return null;
        } catch (error) {
            console.error('获取图片下载链接失败:', error.message);
            return null;
        }
    }

    /**
     * 映射飞书字段到网站字段
     */
    async mapFeishuFields(item) {
        const fields = item.fields || {};

        // 处理URL字段（可能是对象或字符串）
        const urlValue = fields.URL;
        let url = '#';
        if (typeof urlValue === 'string') {
            url = urlValue;
        } else if (urlValue && typeof urlValue === 'object') {
            url = urlValue.link || urlValue.text || '#';
        }

        // 处理封面字段 - 直接使用飞书返回的URL
        let coverUrl = null;
        if (fields.封面 && Array.isArray(fields.封面) && fields.封面.length > 0) {
            const cover = fields.封面[0];
            // 优先使用 url 字段（飞书可直接访问）
            coverUrl = cover.url || cover.public_url || cover.tmp_url;
            // 如果获取失败，使用占位图
            if (!coverUrl) {
                coverUrl = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
                        <rect fill="#e0e0e0" width="800" height="450"/>
                        <text fill="#999" font-family="sans-serif" font-size="24" x="50%" y="50%" text-anchor="middle" dy=".3em">暂无封面</text>
                    </svg>
                `);
            }
        }

        // 处理日期字段（可能是时间戳或日期字符串）
        let publishDate = '';
        if (fields.发布日期) {
            if (typeof fields.发布日期 === 'number') {
                // 时间戳格式
                const date = new Date(fields.发布日期);
                publishDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            } else {
                publishDate = fields.发布日期;
            }
        }

        return {
            标题: fields.标题 || '无标题',
            原标题: fields.原标题 || '',
            频道: fields.频道 || 'General',
            发布日期: publishDate || new Date().toLocaleDateString('zh-CN'),
            视频时长: fields.视频时长 || '',
            封面: coverUrl,
            URL: url,
            状态: fields.状态 || '',
            文章主体: fields.文章主体 || '',
            精彩金句: fields.精彩金句 || '',
            嘉宾: fields.嘉宾 || '未知嘉宾',
            关键洞察: fields.关键洞察 || ''
        };
    }
}

// 导出单例
module.exports = new FeishuService();

/**
 * 内容相关路由
 */

const express = require('express');
const router = express.Router();
const feishuService = require('../services/feishuService');
const { AppError, asyncHandler } = require('../utils/errorHandler');

// 数据缓存
let cachedContents = null;
let lastFetchTime = null;
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION) || 5 * 60 * 1000;

/**
 * 定期拉取飞书数据
 */
async function fetchFeishuData() {
    try {
        console.log(`[${new Date().toLocaleString()}] 开始拉取飞书数据...`);

        const items = await feishuService.fetchRecords();
        console.log(`获取到 ${items.length} 条原始记录`);

        const contentsPromises = items.map(async (item) => {
            return await feishuService.mapFeishuFields(item);
        });
        const contents = await Promise.all(contentsPromises);

        // 只显示状态为"已同步"的文章并排序
        cachedContents = contents
            .filter(item => item.状态 === '已同步')
            .sort((a, b) => {
                const dateA = new Date(a.发布日期);
                const dateB = new Date(b.发布日期);
                return dateB - dateA;
            });

        lastFetchTime = new Date();
        console.log(`数据拉取完成，缓存了 ${cachedContents.length} 条记录`);

        return cachedContents;
    } catch (error) {
        console.error('定期拉取数据失败:', error.response?.data || error.message);
        // 如果缓存为空且有错误，返回空数组
        if (!cachedContents) {
            cachedContents = [];
        }
        return cachedContents;
    }
}

/**
 * GET /api/contents - 获取内容列表
 */
router.get('/', asyncHandler(async (req, res) => {
    // 如果有缓存且未过期，直接使用缓存
    if (cachedContents && lastFetchTime && (Date.now() - lastFetchTime.getTime() < CACHE_DURATION)) {
        console.log('使用缓存数据，上次更新时间:', lastFetchTime.toLocaleString());
        return res.json({
            code: 0,
            data: cachedContents,
            total: cachedContents.length,
            cached: true
        });
    }

    // 否则从飞书拉取新数据
    const data = await fetchFeishuData();

    res.json({
        code: 0,
        data: data,
        total: data.length,
        cached: false
    });
}));

/**
 * GET /api/contents/:id - 获取单条内容
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const recordId = req.params.id;
    const record = await feishuService.fetchRecord(recordId);
    const content = await feishuService.mapFeishuFields(record);

    res.json({
        code: 0,
        data: content
    });
}));

// 初始化时拉取一次数据
fetchFeishuData();

// 设置定期拉取（每5分钟）
setInterval(async () => {
    console.log(`\n[${new Date().toLocaleString()}] 定时任务：检查数据更新...`);
    await fetchFeishuData();
}, CACHE_DURATION);

module.exports = router;

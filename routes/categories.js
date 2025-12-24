/**
 * 分类相关路由
 */

const express = require('express');
const router = express.Router();
const feishuService = require('../services/feishuService');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * GET /api/categories - 获取分类列表
 */
router.get('/', asyncHandler(async (req, res) => {
    const items = await feishuService.fetchRecords();

    const categories = [...new Set(items.map(item => {
        const cat = item.fields?.频道 || item.fields?.category || 'General';
        return cat;
    }))].filter(Boolean);

    res.json({
        code: 0,
        data: categories
    });
}));

module.exports = router;

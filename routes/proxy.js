/**
 * 图片代理路由
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const feishuService = require('../services/feishuService');
const { AppError, asyncHandler } = require('../utils/errorHandler');

/**
 * GET /api/image-proxy - 图片代理接口（解决飞书图片跨域问题）
 */
router.get('/image-proxy', asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url) {
        throw new AppError('缺少URL参数', 400);
    }

    const accessToken = await feishuService.getAccessToken();

    // 转发请求到飞书
    const response = await axios({
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        responseType: 'arraybuffer'
    });

    // 设置正确的Content-Type
    const contentType = response.headers['content-type'] || 'image/webp';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=3600'); // 缓存1小时
    res.send(response.data);
}));

module.exports = router;

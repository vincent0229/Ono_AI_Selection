/**
 * 飞书应用配置
 */

require('dotenv').config();

module.exports = {
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    appToken: process.env.FEISHU_APP_TOKEN,
    tableId: process.env.FEISHU_TABLE_ID,
    viewId: 'vewIBICavz'
};

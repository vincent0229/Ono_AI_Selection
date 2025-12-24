/**
 * 错误处理工具
 */

// 自定义错误类
class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// 统一错误处理中间件
const errorHandler = (err, req, res, next) => {
    const { statusCode = 500, message, details } = err;
    
    // 记录错误日志
    console.error(`[${new Date().toISOString()}] Error:`, {
        statusCode,
        message,
        details: details || err.message,
        path: req.path,
        method: req.method
    });

    // 返回错误响应
    res.status(statusCode).json({
        code: statusCode,
        msg: message || '服务器内部错误',
        details: process.env.NODE_ENV === 'development' ? details : undefined
    });
};

// 异步路由错误包装器
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    asyncHandler
};

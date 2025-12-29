import express from "express";
import http from "http";

const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 添加根路由处理
app.get("/", async (req, res) => {
  try {
    const startTime = Date.now();
    
    console.log(`开始请求健康检查端点: http://122.51.213.200:8088/healthz`);
    
    // 使用 http 模块替代 fetch
    const healthCheckResult = await new Promise((resolve, reject) => {
      const request = http.request(
        'http://122.51.213.200:8088/healthz',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Express-Health-Check/1.0'
          },
          timeout: 50000 // 50秒超时
        },
        (response) => {
          let data = '';
          
          response.on('data', (chunk) => {
            data += chunk;
          });
          
          response.on('end', () => {
            const responseTime = Date.now() - startTime;
            resolve({
              status: response.statusCode,
              statusText: response.statusMessage,
              responseBody: data,
              responseTime: responseTime
            });
          });
        }
      );
      
      request.on('error', (error) => {
        reject(error);
      });
      
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('请求超时'));
      });
      
      request.end();
    });
    
    // 返回健康检查结果
    res.json({
      message: "健康检查结果",
      healthCheck: {
        endpoint: "http://122.51.213.200:8088/healthz",
        status: healthCheckResult.status,
        statusText: healthCheckResult.statusText,
        responseTime: healthCheckResult.responseTime + "ms",
        response: healthCheckResult.responseBody,
        timestamp: new Date().toISOString()
      },
      headers: req.headers
    });
    
  } catch (error) {
    console.error('健康检查请求失败:', error);
    
    res.status(503).json({
      message: "健康检查失败",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 导出处理函数
export default app;

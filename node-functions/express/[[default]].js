import express from "express";
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 添加根路由处理
app.get("/", async (req, res) => {
  try {
    // 记录开始时间
    const startTime = Date.now();
    
    console.log(`开始请求健康检查端点: http://122.51.213.200:8088/healthz`);
    
    // 使用 fetch 请求健康检查端点
    const response = await fetch('http://122.51.213.200:8088/healthz', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Express-Health-Check/1.0'
      },
      timeout: 5000 // 5秒超时
    });
    
    // 计算响应时间
    const responseTime = Date.now() - startTime;
    
    // 获取响应状态和内容
    const status = response.status;
    const statusText = response.statusText;
    const responseBody = await response.text();
    
    console.log(`健康检查响应: 状态=${status}, 响应时间=${responseTime}ms`);
    
    // 返回健康检查结果
    res.json({
      message: "健康检查结果",
      healthCheck: {
        endpoint: "http://122.51.213.200:8088/healthz",
        status: status,
        statusText: statusText,
        responseTime: responseTime + "ms",
        response: responseBody,
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

// 也可以单独添加一个健康检查路由
app.get("/healthz", async (req, res) => {
  try {
    const response = await fetch('http://122.51.213.200:8088/healthz');
    const status = response.status;
    const body = await response.text();
    
    res.status(status).send(body);
  } catch (error) {
    res.status(503).send("Service Unavailable");
  }
});

// 导出处理函数
export default app;

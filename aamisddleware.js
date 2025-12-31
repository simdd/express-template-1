// 中间件文件约定位于根目录下 middleware.js 或 middleware.ts
// 导出方法如下：
export function middleware(context) {
  const { request, next, redirect, rewrite } = context;
  
  // const urlInfo = new URL(request.url);
  // 重定向
  // if (urlInfo.pathname === '/normal') {
  //   return redirect('/blog/index.html');
  // }

  // 重写
  // return rewrite('/api'); //相对路径
  // or
  // return rewrite('https://www.google.com'); // 绝对路径
  
  // 请求透传，return next方法或不返回任何值
  // return next();

  // 修改请求 header
  return next({
      headers: {
        'x-custom-header': 'middleware-added',
        'x-request-id': Math.random(),
      }
  });

  // 直接返回响应
  // return new Response('');


}

// 不导出config，默认匹配所有路由
export const config = {
  matcher: [
    '/:path*', // 匹配所有路由
    // '/normal/:path*', // 匹配动态路由
    // '/api', // 匹配边缘函数
    // '/globe.svg', // 匹配静态资源
  ],
}

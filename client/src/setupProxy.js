const { createProxyMiddleware } = require('http-proxy-middleware');

//proxy로 CORS 이슈 해결하는 방법
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );
};
const { createProxyMiddleware } = require(`http-proxy-middleware`)


module.exports = function(app) {
    // 配置多个代理
    app.use("/pacific", createProxyMiddleware({
        target: 'http://whois.pconline.com.cn',
        changeOrigin: true,
        pathRewrite: {
            // 对路径进行重定向，因为代理的匹配规则是：但检测到路径的pacific时，会在路径前面添加http://whois.pconline.com.cn，
            // 但是我们这个pacific只是用来进行代理识别的，真实url中并没有这个字段，因此我们要将其重定向，检测到pacific时，替换成'/'
            "^/pacific": ""
        }
    }))

}
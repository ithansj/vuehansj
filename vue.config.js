module.exports = {
    //配置热加载模块
    devServer: {
        port: 8888, //端口号
        host: "localhost", //主机名 或者127.0.0.1
        https: false, //https协议
        open: true, //启动服务时，自动打开浏览器访问
        proxy: {
            //匹配以/dev-api开头的请求
            // '/dev-api': {
            [process.env.VUE_APP_BASE_API]: {
                //目标服务器，代理访问到http://localhost:8001
                // target: "http://localhost:8001",
                target: process.env.VUE_APP_SERVICE_URL,
                //开启代理，本地会创建一个虚拟服务器，然后发送请求的数据
                //并同时接受请求的数据，这样服务端和服务端交互，就不存在跨域问题
                changeOrigin: true,
                pathRewrite: {
                    //将dev-api替换为''
                    // '^/dev-api': '',
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
    },

    lintOnSave: false, //关闭格式检查
    productionSourceMap: false //打包时不会生成.map文件，加快打包的速度
}

/** 用于开发环境的服务启动 **/
const path = require("path");			// 获取绝对路径有用
const express = require("express");		// express服务器端框架
const webpack = require("webpack");		// webpack核心
const env = process.env.NODE_ENV;       // 模式（dev开发环境，production生产环境）
const webpackDevMiddleware = require("webpack-dev-middleware");		// webpack服务器
const webpackHotMiddleware = require("webpack-hot-middleware");		// HMR热更新中间件
const webpackConfig = require('./webpack.dev.config.js');			// webpack开发环境的配置文件
const mock = require("./mock/app-data");    // mock模拟数据，模拟后台业务
const bodyParser = require('body-parser');  // express中间件，用于处理post请求的body参数
const app = express();                      // 实例化express服务
const DIST_DIR = webpackConfig.output.path;	// webpack配置中设置的文件输出路径，所有文件存放在内存中
const PORT = 8888;                          // 服务启动端口号
const compiler = webpack(webpackConfig);	// 实例化webpack

if (env === 'production') {                 // 如果是生产环境，则运行build文件夹中的代码
    app.use(express.static('build'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
} else {
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.use(webpackDevMiddleware(compiler, {            // 挂载webpack小型服务器
        publicPath: webpackConfig.output.publicPath,    // 对应webpack配置中的publicPath
        quiet: true,                                   // 是否不输出启动时的相关信息
        stats: {
            colors: true,                               // 不同信息不同颜色
            timings: true                               // 输出各步骤消耗的时间
        },
    }));
    app.use(webpackHotMiddleware(compiler));            // 挂载HMR热更新中间件

    app.get("*", (req, res, next) => {                   // 所有GET请求都返回index.html
        const filename = path.join(DIST_DIR, 'index.html');

        // 由于index.html是由html-webpack-plugin生成到内存中的，所以使用下面的方式获取
        compiler.outputFileSystem.readFile(filename, (err, result) =>{
            if(err){
                return(next(err));
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });
}

/** 监听POST请求，返回MOCK模拟数据 **/
app.post("*", (req, res, next) =>{                   // 所有POST请求都返回index.html
    const result = mock.mockApi(req.originalUrl, req.body);
    res.send(result);
});

/** 启动服务，监听PORT端口 **/
app.listen(PORT, function () {
    console.log('服务已启动: http://localhost:%s', PORT);
});
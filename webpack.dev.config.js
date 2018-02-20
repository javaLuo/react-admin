/* 这是用于开发环境的webpack配置文件 */
var os = require("os");     // 获取系统信息用，用于happyPack插件
var path = require('path'); // 获取绝对路径用
var fs = require('fs');     // 文件操作，用于antd自定义主题
var webpack = require('webpack');       // webpack核心
var HappyPack = require('happypack');   // 多线程构建插件
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // happyPack配置
var HtmlWebpackPlugin = require('html-webpack-plugin');             // 动态生成html插件

module.exports = {
    entry: {
        app: [
            "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", // webpack热更新插件，就这么写
            "babel-polyfill",       // babel垫片库
            "./src/index.js"        // 项目入口
        ]
    },
    output: {
        publicPath: '/',            // 这是在启动服务时，index.html中引用的路径应该相对于此路径
        path: __dirname,            // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
        filename: 'bundle.js'       //编译后的文件名字
    },
    devtool: '#source-map',         // 报错的时候正确的输出哪一行报错

    module: {
        rules: [
            {   // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
                test: /\.js?$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: path.resolve(__dirname, "src")
            },
            {   // .js .jsx用babel解析
                test: /\.js?$/,
                loader: 'happypack/loader?id=happybabel',
                include: path.resolve(__dirname, "src"),
            },
            {   // .css 解析
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ]
            },
            {   // .less 解析
                test: /\.less$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ],
                include: path.resolve(__dirname, "src")
            },
            {   // .less 解析 (用于解析antd的LESS文件)
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', `less-loader`],
                include: path.resolve(__dirname, "node_modules")
            },
            {   // .scss 解析
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {   // 文件解析
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                loader: 'file-loader?name=assets/[name].[ext]'
            },
            {   // 图片解析
                test: /\.(png|jpg|gif)$/,
                include: path.resolve(__dirname, "src"),
                loader: 'url-loader?limit=8192&name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        // https://doc.webpack-china.org/plugins/define-plugin/
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev')     //定义开发环境环境
            }
        }),
        new HtmlWebpackPlugin({                     //根据模板插入css/js等生成最终HTML
            filename: 'index.html',                 //生成的html存放路径，相对于 output.path
            template: './src/index.html',           //html模板路径
            inject: true,                           // 是否将js放在body的末尾
        }),
        new HappyPack({                             // 多线程编译插件
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        // new webpack.optimize.OccurenceOrderPlugin(),         // 这个插件只有webpack1才需要
        new webpack.HotModuleReplacementPlugin(),               // 热更新插件
        // new webpack.optimize.ModuleConcatenationPlugin(),    // 作用域提升，优化打包 (开发环境不需要，与HMR冲突)
        new webpack.NoEmitOnErrorsPlugin()  // 在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss'] //后缀名自动补全
    }
};
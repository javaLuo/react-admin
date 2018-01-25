var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');     // 为了单独打包css
var HtmlWebpackPlugin = require('html-webpack-plugin');             // 生成html

module.exports = {
    entry: {
        app: ["babel-polyfill", path.resolve(__dirname, 'src', 'index')]
    },
    output: {
        path: path.resolve(__dirname, 'build/dist'),    // 将文件打包到此目录下
        publicPath: 'dist/',                           // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js',
    },
    module: {
        rules: [
            {   // .js .jsx用babel解析
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src"), path.resolve(__dirname, "mock")],
                loader: 'babel-loader'
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
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),

        /**
            CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，
            这个文件包括多个入口 chunk 的公共模块。通过将公共模块拆出来，最终合成的文件能够
            在最开始的时候加载一次，便存起来到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。
        **/ 
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',                    // 公共chunk名
            filename: 'vendors.[hash:6].js',    // 生成的文件名
            minChunks: function(module, count) {
               return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) < 0;
            }
        }),

        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin({
            filename:'[name].[hash:6].css', // 生成的文件名
            allChunks: true,                // 从所有chunk中提取
        }),

        // Uglify 加密压缩源代码
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: true,     // 删除代码中所有注释
            },
            compress: {
                warnings: false,    // 删除没有用的代码时是否发出警告
                drop_console: true, // 是否删除所有的console
            },
        }),

        // 作用域提升，优化打包
        new webpack.optimize.ModuleConcatenationPlugin(),

        // 此插件详细教程 http://www.cnblogs.com/haogj/p/5160821.html
        new HtmlWebpackPlugin({                     //根据模板插入css/js等生成最终HTML
            filename: '../index.html',              //生成的html存放路径，相对于 output.path
            template: './src/index.html',           //html模板路径
            favicon: 'favicon.ico',                 // 自动把根目录下的favicon.ico图片加入html
            inject: true,                           // 是否将js放在body的末尾
        }),

    ],
    // 解析器， webpack提供的各种方便的工具函数
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss'], //后缀名自动补全
    }
};
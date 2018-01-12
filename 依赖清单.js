/**
 * 这个文件只是记录用到的各种依赖包的作用
 * 因为正式的JSON文件里面不允许有注释，所以写在这里
 * **/

/**
 * package.json
 * 项目配置文件 说明
 * **/
const packageJson = {
    "name": "react_luo",                    // 项目名字
    "version": "1.0.0",                     // 项目版本
    "description": "react脚手架,最新技术",  // 项目描述
    "main": "index.js",                     // 项目入口文件（其实没用，因为配置了server.js）
    "scripts": {                            // 自定义的脚本
        "dev": "node server.js",            // 脚本 - 启动开发环境
        "build": "npm run clear && webpack -p --config webpack.production.config.js --progress --profile --colors",     // 脚本 - 正式打包，生成最终代码
        "dist": "set NODE_ENV=production&& node server.js",     // 脚本 - 启动生产环境的代码（用于测试最终代码）
        "clear": "rimraf ./build",                              // 脚本 - 删除build文件夹（每次打包前自动调用）
        "cover": "./node_modules/.bin/istanbul cover _mocha",   // 脚本 - 用于第三方代码测试自动调用（不用管）
        "coveralls": "npm run cover -- --report lcovonly && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls"   // 脚本 - 用于第三方代码测试自动调用（不用管）
},
    "author": "luo",    // 项目作者
    "license": "ISC",   // 项目开源协议
    "private": true,    // 项目在npm上是否私有
    "repository": {     // 项目的源码存放仓库配置
        "type": "git",  // 用git存的
        "url": "git+https://github.com/javaLuo/react-luo.git"   // 仓库地址
    },
    "dependencies": {   // 项目依赖包
        "antd": "^3.1.0",                           // 蚂蚁金服antd组件库
        "axios": "^0.17.1",                         // 封装的fetch的异步请求库
        "bundle-loader": "^0.5.5",                  // 用于异步加载、代码分割的组件加载器
        "classnames": "^2.2.5",                     // 在className中添加多个属性时需用此插件封装
        "history": "^4.7.2",                        // 历史对象，项目中用的是这个，没有用react-router自带的history
        "immutable": "^3.8.2",                      // 一个控制变量改变的库，总是返回新的对象（项目中没用到，只是antd依赖这个）
        "lodash": "^4.17.4",                        // 提供了很多方便的工具，最常用的是cloneDeep深拷贝
        "prop-types": "^15.6.0",                    // 检查props参数类型的工具库
        "react": "^16.2.0",                         // React 核心
        "react-dom": "^16.2.0",                     // React Dom操作相关的工具库
        "react-redux": "^5.0.6",                    // React和Redux连接的桥梁
        "react-router": "^4.2.0",                   // React路由核心库
        "react-router-dom": "^4.2.2",               // React路由工具库
        "react-router-redux": "^5.0.0-alpha.6",     // React路由和Redux连接的桥梁
        "redux": "^3.7.2",                          // Redux状态管理库
        "redux-logger": "^3.0.6",                   // 一个记录Redux触发的日志工具，项目中默认注释掉了，可在src/store/index.js中查看
        "redux-thunk": "^2.2.0",                    // 用于在action中支持异步请求的redux中间件
        "reqwest": "^2.0.5"                         // 封装了ajax的异步请求库
},
    "devDependencies": {  // 项目开发环境依赖包
        "babel-core": "^6.26.0",                                // Babel 核心
        "babel-eslint": "^8.1.2",                               // 让Eslint代码检测时，支持一些新语法，比如Eslint本身不认识修饰器@（在.eslintrc.json配置了）
        "babel-loader": "^7.1.2",                               // Webpack解析器 - 用于解析项目中js的新语法
        "babel-plugin-import": "^1.6.3",                        // Babel插件 - 用于antd组件的按需加载（在.babelrc中配置了）
        "babel-plugin-transform-class-properties",              // Babel插件 - 用于让class类中支持定义箭头函数的语法
        "babel-plugin-transform-decorators-legacy": "^1.3.4",   // Babel插件 - 支持ES7 修饰器语法Decorator
        "babel-plugin-transform-runtime": "^6.23.0",            // Babel插件 - 所有的垫片函数将引用babel-runtime中的，避免重复编译
        "babel-polyfill": "^6.26.0",                            // Babel垫片库，支持ES6的一些新功内容，比如Set和Map
        "babel-preset-env": "^1.6.1",                           // Babel根据浏览器和运行时环境自动识别运用哪些垫片库来兼容ES6+语法
        "babel-preset-react": "^6.24.1",                        // Babel支持react语法
        "babel-runtime": "^6.26.0",                             // Babel垫片库，提供了各种ES6的垫片，最终会自动编译为ES5
        "css-loader": "^0.28.8",                                // Webpack解析器 - 用于解析js中import的css，和css中所有url()中的路径问题
        "eslint": "^4.15.0",                                    // Eslint 代码规范检测器
        "eslint-loader": "^1.9.0",                              // Webpack解析器 - 打包时检测代码规范时用
        "eslint-plugin-react": "^7.5.1",                        // Eslint插件 - 让Eslint支持检测React语法（JSX）（.eslintrc.json中配置的plugins参数）
        "express": "^4.16.2",                                   // Node.js框架 - 用于server.js中提供开发环境的服务
        "extract-text-webpack-plugin": "^3.0.2",                // Webpack插件 - 用于提取项目中的所有CSS，生成单独的.css文件（webpack.production.config.js中有配置）
        "file-loader": "^1.1.6",                                // Webpack解析器 - 解析各类文件时有用，图片、音频、视频等,处理它们的相对路径问题
        "happypack": "^4.0.0",                                  // Webpack插件 - 可使用多线程来编译打包，增加编译速度
        "html-webpack-plugin": "^2.30.1",                       // Webpack插件 - 最终打包时自动生成index.html，并自动配置index.html中的类容
        "less": "^2.7.3",                                       // Less 核心
        "less-loader": "^4.0.5",                                // Webpack解析器 - 解析Less,主要是解析antd的样式文件
        "mockjs": "^1.0.1-beta3",                               // Mock 模拟假数据的库
        "node-sass": "^4.7.2",                                  // Sass 核心
        "postcss-loader": "^2.0.10",                            // Webpack解析器 - 用于进一步解析CSS，比如自动添加-webkit-前缀等
        "rimraf": "^2.6.2",                                     // 文件操作工具 - 用于删除文件（package.json的scripts.clear脚本用到了）
        "sass-loader": "^6.0.6",                                // Webpack解析器 - 解析.sass/.scss文件，编译为.css
        "style-loader": "^0.19.1",                              // Webpack解析器 - 用于将css文件的代码加入到index.html中的<style>标签里
        "url-loader": "^0.6.2",                                 // Webpack解析器 - 用于处理一些小图片，把它们编译为base64，同时也处理它们的相对路径
        "webpack": "^3.10.0",                                   // Webpack 核心
        "webpack-dev-middleware": "^2.0.3",                     // Webpack小型服务器（server.js中用这个来搭建开发环境所需的服务）
        "webpack-hot-middleware": "^2.21.0"                     // Webpack热更新插件（server.js中用这个来启动代码热更新的功能）
    }
};

/**
 * .babelrc
 * Babel语法编译器配置文件 说明
 * **/
const babelrc = {
    "presets": [                        // babel初始化设置
        "babel-preset-react",           // 引用babel-preset-react库 支持react语法
        [
            "babel-preset-env",         // 引用babel-preset-env库 让babe支持ES6+语法
            {
                "modules": false,       // 是否将ES6语法转换为模块（commonjs或amd或umd等）
                "targets": {            // 指定需要支持哪些版本的环境
                    "ie": 9             // 支持到IE9
                }
            }
        ]
    ],
    "plugins": [                        // 所需要的插件
        "transform-runtime",            // babel运行时垫片库
        "transform-decorators-legacy",  // 支持修饰器语法
        [
            "import",                   // babel-plugin-import按需加载插件
            {
                "libraryName": "antd",  // 需要按需加载的包的名字
                "style": true           // true - 加载antd的less样式文件， 'css' - 加载antd的css样式文件
            }
        ]
    ]
};

/**
 * .eslintrc.json
 * Eslint语法检测配置文件 说明
 * **/
const eslintrc = {
    "env": {                                        // 需要启用的全局变量（即哪些变量名被eslint默认存在而不用显式声明）
        "browser": true,                            // 浏览器中的全局对象，主要是window
        "commonjs": true,                           // commonjs规范中的全局对象
        "es6": true,                                // ES6中的全局对象
        "mocha": true,                              // MoCha库的全局对象
        "jquery": true                              // jquery的全局对象$
    },
    "parser": "babel-eslint",                       // 解析器用的babel-eslint解析器，不然有些新语法Eslint无法识别
    "extends": "plugin:react/recommended",          // 基础语法规则：react语法，将被全局继承
    "parserOptions": {                              // 其他初始化设置
        "ecmaVersion": 8,                           // 识别到哪个ES版本的语法
        "ecmaFeatures": {                           // 额外的语言特性
            "impliedStrict": true,                  // 启用严格模式
            "experimentalObjectRestSpread": true,   // 启用对实验性的 object rest/spread properties 的支持
            "jsx": true                             // 启用对JSX的支持
        },
        "sourceType": "module"                       // 代码类型：项目中是用ES6模块import/export来构建的，所以这里设置module
    },
    "plugins": [                                     // 插件
        "react"                                      // eslint-plugin-react插件，支持react语法
    ],
    "rules": {                                       // 自定义规则
        "semi": "warn",                              // 缺少结尾分号，将警告
        "no-cond-assign": "error",                   // 禁止条件表达式中出现赋值操作符
        "no-debugger": "error",                      // 禁用debugger语句
        "no-dupe-args": "error",                     // 禁止 function 定义中出现重名参数
        "no-caller": "error",                        // 禁用 arguments.caller 或 arguments.callee
        "no-unmodified-loop-condition": "error",     // 禁止死循环（循环条件不变）
        "no-with": "error",                          // 禁用with语句
        "no-catch-shadow": "error"                   // 禁止 catch 子句的参数与外层作用域中的变量同名
    }
};


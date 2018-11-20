# [React-admin](https://github.com/javaLuo/react-admin/) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

标准后台管理系统解决方案<br/>
动态菜单配置，权限精确到按钮<br/>
完成进度： 80%

## what's this?

react+redux后台管理系统脚手架<br/>
react+redux+webpack+antd
<ul>
 <li>非服务端渲染</li>
 <li>仿antd-pro外观，但没有使用dva和roadhog</li>
</ul>

## 内置通用功能

  用户管理 增删改查 分配角色<br/>
  角色管理 增删改查 分配菜单和权限<br/>
  权限管理 增删改查<br/>
  菜单管理 增删改查<br/>
  
  关系：权限 依附于 菜单 依附于 角色 依附于 用户

## 构建 Start

```
npm install       # 安装依赖模块
```

```
npm run dev       # 运行开发环境，默认监听8888端口
```

```
npm run build     # 正式打包，用于生产环境
```

```
npm run dist     # 运行正式打包后的最终代码，默认监听8888端口
```

## 预览地址 Demo

https://isluo.com/work/admin <br/>
账号：admin / user<br/>
密码：123456 / 123456

## 参考
react-luo: https://github.com/javaLuo/react-luo <br/>


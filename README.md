<p align="center">
  <a href="https://github.com/javaLuo/react-admin/">
    <img alt="react-router" src="http://isluo.com/imgs/react-logo.jpg" width="100">
  </a>
</p>

# [React-admin](https://github.com/javaLuo/react-admin/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]

标准后台管理系统解决方案<br/>
完成进度： 60%

## what's this?

react+redux后台管理系统脚手架<br/>
react+redux+webpack+antd
<ul>
 <li>非服务端渲染</li>
 <li>仿antd-pro外观，但没有使用dva和roadhog，而是使用标准的react+redux分层结构</li>
</ul>

## 为了解决什么问题？

目前的权限问题基本上全部由后台控制，通过在接口处做判断，当前用户有权限则返回数据，没权限则不返回数据。<br/>
现在也比较推荐这样的做法。<br/>
但有的项目就要求须要"导航菜单可动态配置"、"无权限的按钮自动隐藏"等这些功能，就得在前端做相应的处理。<br/>
后端动态配置的菜单和权限虽然存到数据库里了，但实际上还是要跟前端代码中设置的相对应才会有效。

## 框架中包含的通用模块

首页

系统管理：
  用户管理
  角色管理
  权限管理
  菜单管理
  
404页

关系：权限 依附于 菜单 依附于 角色 依附于 用户

## 预览地址 Demo

http://isluo.com/work/admin/index.html <br/>
账号：admin / user
密码：123456 / 123456

## 参考
react-luo: https://github.com/javaLuo/react-luo <br/>


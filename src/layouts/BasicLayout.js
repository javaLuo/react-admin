/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 必需的各种插件
// ==================
import React, { useState } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import tools from "../util/tools";

// ==================
// 所需的所有组件
// ==================
import { Layout, message } from "antd";
import Header from "../a_component/Header";
import Menu from "../a_component/Menu";
import Footer from "../a_component/Footer";
import Bread from "../a_component/Bread";
import Loading from "../a_component/loading";
import "./BasicLayout.less";

// ==================
// 异步加载各路由模块
// ==================
const [NotFound, NoPower, Home, MenuAdmin, PowerAdmin, RoleAdmin, UserAdmin] = [
  () => import(`../a_container/ErrorPages/404`),
  () => import(`../a_container/ErrorPages/401`),
  () => import(`../a_container/Home`),
  () => import(`../a_container/System/MenuAdmin`),
  () => import(`../a_container/System/PowerAdmin`),
  () => import(`../a_container/System/RoleAdmin`),
  () => import(`../a_container/System/UserAdmin`),
].map((item) => {
  return Loadable({
    loader: item,
    loading: Loading,
  });
});

// ==================
// Class
// ==================
const { Content } = Layout;

function BasicLayoutCom(props) {
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起

  /** 点击切换菜单状态 **/
  function onToggle() {
    setCollapsed(!collapsed);
  }

  /** 退出登录 **/
  function onLogout() {
    props.onLogout().then(() => {
      message.success("退出成功");
      props.history.push("/user/login");
    });
  }

  /**
   * 工具 - 判断当前用户是否有该路由权限，如果没有就跳转至401页
   * @param pathname 路由路径
   * **/
  function checkRouterPower(pathname) {
    let menus;
    if (props.userinfo.menus && props.userinfo.menus.length) {
      menus = props.userinfo.menus;
    } else if (sessionStorage.getItem("userinfo")) {
      menus = JSON.parse(tools.uncompile(sessionStorage.getItem("userinfo")))
        .menus;
    }
    const m = menus.map((item) => item.url.replace(/^\//, "")); // 当前用户拥有的所有菜单
    const urls = pathname.split("/").filter((item) => !!item);
    for (let i = 0; i < urls.length; i++) {
      if (!m.includes(urls[i])) {
        return false;
      }
    }
    return true;
  }

  /** 切换路由时触发 **/
  function onEnter(Component, props) {
    /**
     * 检查当前用户是否有该路由页面的权限
     * 没有则跳转至401页
     * **/
    if (checkRouterPower(props.location.pathname)) {
      return <Component {...props} />;
    }
    return <Redirect to="/nopower" />;
  }

  return (
    <Layout className="page-basic">
      <Menu
        data={props.userinfo.menus}
        collapsed={collapsed}
        location={props.location}
        history={props.history}
      />
      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={props.userinfo}
          onToggle={onToggle}
          onLogout={onLogout}
        />
        <Bread menus={props.userinfo.menus} location={props.location} />
        <Content className="content">
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route
              exact
              path="/home"
              render={(props) => onEnter(Home, props)}
            />

            <Route
              exact
              path="/system/menuadmin"
              render={(props) => onEnter(MenuAdmin, props)}
            />
            <Route
              exact
              path="/system/poweradmin"
              render={(props) => onEnter(PowerAdmin, props)}
            />
            <Route
              exact
              path="/system/roleadmin"
              render={(props) => onEnter(RoleAdmin, props)}
            />
            <Route
              exact
              path="/system/useradmin"
              render={(props) => onEnter(UserAdmin, props)}
            />
            <Route exact path="/nopower" component={NoPower} />
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
  }),
  (dispatch) => ({
    onLogout: dispatch.app.onLogout,
  })
)(BasicLayoutCom);

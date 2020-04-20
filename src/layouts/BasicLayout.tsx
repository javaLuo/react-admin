/** 基础页面结构 - 有头部、底部、侧边导航 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import loadable from "@loadable/component";
import { Layout, message } from "antd";

// ==================
// 自定义的东西
// ==================
import tools from "@/util/tools";
import "./BasicLayout.less";

// ==================
// 组件
// ==================
import Header from "@/components/Header";
import MenuCom from "@/components/Menu";
import Footer from "@/components/Footer";
import Bread from "@/components/Bread";
import Loading from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";

const { Content } = Layout;

// ==================
// 异步加载各路由模块
// ==================
const [NotFound, NoPower, Home, MenuAdmin, PowerAdmin, RoleAdmin, UserAdmin] = [
  () => import(`../pages/ErrorPages/404`),
  () => import(`../pages/ErrorPages/401`),
  () => import(`../pages/Home`),
  () => import(`../pages/System/MenuAdmin`),
  () => import(`../pages/System/PowerAdmin`),
  () => import(`../pages/System/RoleAdmin`),
  () => import(`../pages/System/UserAdmin`),
].map((item) => {
  return loadable(item, {
    fallback: <Loading />,
  });
});

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";
import { Menu } from "@/models/index.type";
import { History } from "history";

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> & {
    history: History;
    location: Location;
  };

// ==================
// 本组件
// ==================
function BasicLayoutCom(props: Props): JSX.Element {
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起

  // 退出登录
  const onLogout = useCallback(() => {
    props.onLogout().then(() => {
      message.success("退出成功");
      props.history.push("/user/login");
    });
  }, [props]);

  /**
   * 工具 - 判断当前用户是否有该路由权限，如果没有就跳转至401页
   * @param pathname 路由路径
   * **/
  const checkRouterPower = useCallback(
    (pathname: string) => {
      let menus: Menu[] = [];
      if (props.userinfo.menus && props.userinfo.menus.length) {
        menus = props.userinfo.menus;
      } else if (sessionStorage.getItem("userinfo")) {
        menus = JSON.parse(
          tools.uncompile(sessionStorage.getItem("userinfo") || "[]")
        ).menus;
      }
      const m: string[] = menus.map((item) => item.url.replace(/^\//, "")); // 当前用户拥有的所有菜单
      const urls: string[] = pathname.split("/").filter((item) => !!item);
      for (let i = 0; i < urls.length; i++) {
        if (!m.includes(urls[i])) {
          return false;
        }
      }
      return true;
    },
    [props.userinfo.menus]
  );

  // 切换路由时触发
  const onEnter = useCallback(
    (Component, props) => {
      /**
       * 检查当前用户是否有该路由页面的权限
       * 没有则跳转至401页
       * **/
      if (checkRouterPower(props.location.pathname)) {
        return <Component {...props} />;
      }
      return <Redirect to="/nopower" />;
    },
    [checkRouterPower]
  );

  return (
    <Layout className="page-basic" hasSider>
      <MenuCom
        data={props.userinfo.menus}
        collapsed={collapsed}
        location={props.location}
        history={props.history}
      />

      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={props.userinfo}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        <Bread menus={props.userinfo.menus} location={props.location} />
        <Content className="content">
          <ErrorBoundary location={props.location}>
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
          </ErrorBoundary>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

const mapState = (state: RootState) => ({
  userinfo: state.app.userinfo,
});
const mapDispatch = (dispatch: Dispatch) => ({
  onLogout: dispatch.app.onLogout,
});
export default connect(mapState, mapDispatch)(BasicLayoutCom);

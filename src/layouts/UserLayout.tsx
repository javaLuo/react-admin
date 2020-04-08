/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的第三方库
// ==================
import React from "react";
import loadable from "@loadable/component";
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout } from "antd";

// ==================
// 自定义的东西
// ==================
import "./UserLayout.less";

// ==================
// 组件
// ==================
import Loading from "../components/Loading";
import Footer from "../components/Footer";

const { Content } = Layout;

// ==================
// 异步加载各路由模块
// ==================
const [NotFound, Login] = [
  () => import("../pages/ErrorPages/404"),
  () => import("../pages/Login"),
].map((item) => {
  return loadable(item, {
    fallback: <Loading />,
  });
});

// ==================
// 本组件
// ==================
export default function AppContainer(): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">
        <Switch>
          <Redirect exact from="/user" to="/user/login" />
          <Route exact path="/user/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </Content>
      <Footer className="user-layout" />
    </Layout>
  );
}

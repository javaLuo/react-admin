/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { Route, Switch, Redirect } from "react-router-dom";

// ==================
// 所需的所有组件
// ==================
import { Layout } from "antd";
import Loading from "../a_component/loading";
import Footer from "../a_component/Footer";
import "./UserLayout.less";

// ==================
// 路由
// ==================
const [NotFound, Login] = [
  () => import("../a_container/ErrorPages/404"),
  () => import("../a_container/Login"),
].map((item) => {
  return Loadable({
    loader: item,
    loading: Loading,
  });
});

const { Content } = Layout;

function AppContainer(props) {
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

export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(AppContainer);

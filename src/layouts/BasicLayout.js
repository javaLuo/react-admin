/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 必需的各种插件
// ==================
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import { Route, Switch, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import tools from "../util/tools";
// ==================
// 所需的所有普通组件
// ==================
import { Layout, message } from "antd";
import Header from "../a_component/Header";
import Menu from "../a_component/Menu";
import Footer from "../a_component/Footer";
import Bread from "../a_component/Bread";
import Loading from "../a_component/loading";
import "./BasicLayout.scss";

// ==================
// 路由
// ==================

const [NotFound, NoPower, Home, MenuAdmin, PowerAdmin, RoleAdmin, UserAdmin] = [
  () => import(`../a_container/ErrorPages/404`),
  () => import(`../a_container/ErrorPages/401`),
  () => import(`../a_container/home`),
  () => import(`../a_container/System/MenuAdmin`),
  () => import(`../a_container/System/PowerAdmin`),
  () => import(`../a_container/System/RoleAdmin`),
  () => import(`../a_container/System/UserAdmin`)
].map(item => {
  return Loadable({
    loader: item,
    loading: Loading
  });
});

// ==================
// 本页面所需action
// ==================

import {
  onLogout,
  setUserInfo,
  getNews,
  clearNews,
  getNewsTotal
} from "../a_action/app-action";

// ==================
// Class
// ==================
const { Content } = Layout;
@connect(
  state => ({
    userinfo: state.app.userinfo,
    powers: state.app.powers,
    menus: state.app.menus
  }),
  dispatch => ({
    actions: bindActionCreators(
      { onLogout, setUserInfo, getNews, clearNews, getNewsTotal },
      dispatch
    )
  })
)
export default class AppContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    powers: P.array,
    userinfo: P.any,
    menus: P.array
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false, // 侧边栏是否收起
      popLoading: false, // 用户消息是否正在加载
      clearLoading: false // 用户消息是否正在清楚
    };
  }

  /** 点击切换菜单状态 **/
  onToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  /**
   * 退出登录
   * **/
  onLogout = () => {
    this.props.actions.onLogout().then(() => {
      message.success("退出成功");
      this.props.history.push("/user/login");
    });
  };

  /**
   * 工具 - 判断当前用户是否有该路由权限，如果没有就跳转至401页
   * @pathname: 路由路径
   * **/
  checkRouterPower(pathname) {
    let menus;
    if (this.props.menus && this.props.menus.length) {
      menus = this.props.menus;
    } else if (sessionStorage.getItem("userinfo")) {
      menus = JSON.parse(tools.uncompile(sessionStorage.getItem("userinfo")))
        .menus;
    }
    const m = menus.map(item => item.url.replace(/^\//, "")); // 当前用户拥有的所有菜单
    const urls = pathname.split("/").filter(item => !!item);
    for (let i = 0; i < urls.length; i++) {
      if (!m.includes(urls[i])) {
        return false;
      }
    }
    return true;
  }

  /** 切换路由时触发 **/
  onEnter(Component, props) {
    /**
     * 检查当前用户是否有该路由页面的权限
     * 没有则跳转至401页
     * **/
    if (this.checkRouterPower(props.location.pathname)) {
      return <Component {...props} />;
    }
    return <Redirect to="/nopower" />;
  }

  render() {
    const u = this.props.userinfo;

    return (
      <Layout className="page-basic">
        <Menu
          data={this.props.menus}
          collapsed={this.state.collapsed}
          location={this.props.location}
        />
        <Layout>
          <Header
            collapsed={this.state.collapsed}
            userinfo={this.props.userinfo}
            onToggle={this.onToggle}
            onLogout={this.onLogout}
            getNews={this.getNews}
            clearNews={this.clearNews}
            newsData={this.state.newsData}
            newsTotal={this.state.newsTotal}
            popLoading={this.state.popLoading}
            clearLoading={this.state.clearLoading}
          />
          <Bread menus={this.props.menus} location={this.props.location} />
          <Content className="content">
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route
                exact
                path="/home"
                render={props => this.onEnter(Home, props)}
              />

              <Route
                exact
                path="/system/menuadmin"
                render={props => this.onEnter(MenuAdmin, props)}
              />
              <Route
                exact
                path="/system/poweradmin"
                render={props => this.onEnter(PowerAdmin, props)}
              />
              <Route
                exact
                path="/system/roleadmin"
                render={props => this.onEnter(RoleAdmin, props)}
              />
              <Route
                exact
                path="/system/useradmin"
                render={props => this.onEnter(UserAdmin, props)}
              />
              <Route exact path="/nopower" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}

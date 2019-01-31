/** 头部 **/
import React from "react";
import P from "prop-types";
import { Link } from "react-router-dom";
import { Layout, Icon, Tooltip, Menu, Dropdown } from "antd";

import "./index.scss";
const { Header } = Layout;
export default class Com extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false // 当前是否是全屏状态
    };
  }

  /** 点击左侧按钮时触发 **/
  toggle = () => {
    this.props.onToggle();
  };

  /**
   * 进入全屏
   * **/
  requestFullScreen = () => {
    const element = document.documentElement;
    // 判断各种浏览器，找到正确的方法
    const requestMethod =
      element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome等
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      //for Internet Explorer
      const wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
    this.setState({
      fullScreen: true
    });
  };

  /**
   * 退出全屏
   */
  exitFullScreen = () => {
    // 判断各种浏览器，找到正确的方法
    const exitMethod =
      document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen;
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
      //for Internet Explorer
      const wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
    this.setState({
      fullScreen: false
    });
  };

  /**
   * 退出登录
   * **/
  onMenuClick = e => {
    if (e.key === "logout") {
      // 退出按钮被点击
      this.props.onLogout();
    }
  };

  render() {
    const u = this.props.userinfo;
    return (
      <Header className="header">
        <Tooltip
          placement="bottom"
          title={this.props.collapsed ? "展开菜单" : "收起菜单"}
        >
          <Icon
            className={
              this.props.collapsed
                ? "trigger flex-none"
                : "trigger flex-none fold"
            }
            type={"menu-unfold"}
            onClick={this.toggle}
          />
        </Tooltip>
        <div className="rightBox flex-auto flex-row flex-je flex-ac">
          <Tooltip
            placement="bottom"
            title={this.state.fullScreen ? "退出全屏" : "全屏"}
          >
            <div className="full">
              <Icon
                className="icon flex-none"
                type={this.state.fullScreen ? "shrink" : "arrows-alt"}
                onClick={
                  this.state.fullScreen
                    ? this.exitFullScreen
                    : this.requestFullScreen
                }
              />
            </div>
          </Tooltip>
          {u ? (
            <Dropdown
              overlay={
                <Menu
                  className="menu"
                  selectedKeys={[]}
                  onClick={this.onMenuClick}
                >
                  <Menu.Item>
                    <a
                      href="https://blog.isluo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon type="global" />
                      blog.isluo.com
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      href="https://github.com/javaLuo/react-admin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon type="github" />
                      GitHub
                    </a>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="logout">
                    <Icon type="logout" />
                    退出登录
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <div className="userhead flex-row flex-ac">
                <Icon type="smile-o" />
                <span className="username">{u.username}</span>
              </div>
            </Dropdown>
          ) : (
            <Tooltip placement="bottom" title="点击登录">
              <div className="full">
                <Link to="/user/login">未登录</Link>
              </div>
            </Tooltip>
          )}
        </div>
      </Header>
    );
  }
}

Com.propTypes = {
  onToggle: P.func, // 菜单收起与展开状态切换
  collapsed: P.bool, // 菜单的状态
  onLogout: P.func, // 退出登录
  userinfo: P.object, // 用户信息
  popLoading: P.bool // 消息弹窗是否正在加载数据
};

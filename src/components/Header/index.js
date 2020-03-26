/** 头部 **/

// Com.propTypes = {
//   onToggle: P.func, // 菜单收起与展开状态切换
//   collapsed: P.bool, // 菜单的状态
//   onLogout: P.func, // 退出登录
//   userinfo: P.object, // 用户信息
//   popLoading: P.bool // 消息弹窗是否正在加载数据
// };

import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Layout, Tooltip, Menu, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  GithubOutlined,
  ChromeOutlined,
  LogoutOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import "./index.less";
const { Header } = Layout;

export default function HeaderCom(props) {
  const [fullScreen, setFullScreen] = useState(false); // 当前是否是全屏状态
  /**
   * 进入全屏
   * **/
  const requestFullScreen = useCallback(() => {
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
    setFullScreen(true);
  }, []);

  /**
   * 退出全屏
   */
  const exitFullScreen = useCallback(() => {
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
    setFullScreen(false);
  }, []);

  /**
   * 退出登录
   * **/
  const onMenuClick = useCallback(
    (e) => {
      if (e.key === "logout") {
        // 退出按钮被点击
        props.onLogout();
      }
    },
    [props]
  );

  const u = props.userinfo.userBasicInfo;
  return (
    <Header className="header">
      <Tooltip placement="bottom" title={props.collapsed ? "展开菜单" : "收起菜单"}>
        <MenuFoldOutlined className={props.collapsed ? "trigger fold" : "trigger"} onClick={props.onToggle} />
      </Tooltip>
      <div className="rightBox">
        <Tooltip placement="bottom" title={fullScreen ? "退出全屏" : "全屏"}>
          <div className="full all_center">
            {fullScreen ? (
              <FullscreenExitOutlined className="icon" onClick={exitFullScreen} />
            ) : (
              <FullscreenOutlined className="icon" onClick={requestFullScreen} />
            )}
          </div>
        </Tooltip>
        {u ? (
          <Dropdown
            overlay={
              <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
                <Menu.Item>
                  <a href="https://blog.isluo.com" target="_blank" rel="noopener noreferrer">
                    <ChromeOutlined />
                    blog.isluo.com
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a href="https://github.com/javaLuo/react-admin" target="_blank" rel="noopener noreferrer">
                    <GithubOutlined />
                    GitHub
                  </a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                  <LogoutOutlined />
                  退出登录
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight">
            <div className="userhead all_center">
              <SmileOutlined />
              <span className="username">{u.username}</span>
            </div>
          </Dropdown>
        ) : (
          <Tooltip placement="bottom" title="点击登录">
            <div className="full all_center">
              <Link to="/user/login">未登录</Link>
            </div>
          </Tooltip>
        )}
      </div>
    </Header>
  );
}

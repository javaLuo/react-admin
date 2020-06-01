/** 头部 **/

// ==================
// 第三方库
// ==================
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

const { Header } = Layout;

// ==================
// 自定义的东西
// ==================
import "./index.less";

// ==================
// 类型声明
// ==================
import { UserInfo } from "@/models/index.type";

interface Element {
  webkitRequestFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  mozCancelFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

interface Props {
  collapsed: boolean; // 菜单的状态
  userinfo: UserInfo; // 用户信息
  onToggle: () => void; // 菜单收起与展开状态切换
  onLogout: () => void; // 退出登录
}

export default function HeaderCom(props: Props): JSX.Element {
  const [fullScreen, setFullScreen] = useState(false); // 当前是否是全屏状态
  // 进入全屏
  const requestFullScreen = useCallback(() => {
    const element: HTMLElement & Element = document.documentElement;
    // 判断各种浏览器，找到正确的方法
    const requestMethod =
      element.requestFullscreen || // W3C
      element.webkitRequestFullscreen || // Chrome等
      element.mozRequestFullScreen || // FireFox
      element.msRequestFullscreen; // IE11
    if (requestMethod) {
      requestMethod.call(element);
    }
    setFullScreen(true);
  }, []);

  // 退出全屏
  const exitFullScreen = useCallback(() => {
    // 判断各种浏览器，找到正确的方法
    const element: Document & Element = document;
    const exitMethod =
      element.exitFullscreen || // W3C
      element.mozCancelFullScreen || // firefox
      element.webkitExitFullscreen || // Chrome等
      element.msExitFullscreen; // IE11

    if (exitMethod) {
      exitMethod.call(document);
    }
    setFullScreen(false);
  }, []);

  // 退出登录
  const onMenuClick = useCallback(
    (e) => {
      // 退出按钮被点击
      if (e.key === "logout") {
        props.onLogout();
      }
    },
    [props]
  );

  const u = props.userinfo.userBasicInfo;
  return (
    <Header className="header">
      <Tooltip
        placement="bottom"
        title={props.collapsed ? "展开菜单" : "收起菜单"}
      >
        <MenuFoldOutlined
          className={props.collapsed ? "trigger fold" : "trigger"}
          onClick={() => props.onToggle()}
        />
      </Tooltip>
      <div className="rightBox">
        <Tooltip placement="bottom" title={fullScreen ? "退出全屏" : "全屏"}>
          <div className="full all_center">
            {fullScreen ? (
              <FullscreenExitOutlined
                className="icon"
                onClick={exitFullScreen}
              />
            ) : (
              <FullscreenOutlined
                className="icon"
                onClick={requestFullScreen}
              />
            )}
          </div>
        </Tooltip>
        {u ? (
          <Dropdown
            overlay={
              <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
                <Menu.Item>
                  <a
                    href="https://blog.isluo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ChromeOutlined />
                    blog.isluo.com
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    href="https://github.com/javaLuo/react-admin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
            placement="bottomRight"
          >
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

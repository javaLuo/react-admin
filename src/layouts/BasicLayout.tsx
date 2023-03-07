/** 基础页面结构 - 有头部、底部、侧边导航 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, useNavigate, Outlet } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
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
//import BreadTab from "@/components/BreadTab"; // Tab方式的导航

const { Content } = Layout;

// ==================
// 类型声明
// ==================
import type { RootState, Dispatch } from "@/store";
import type { Menu } from "@/models/index.type";
import type { History } from "history";

// ==================
// 本组件
// ==================
function BasicLayoutCom(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起

  // 退出登录
  const onLogout = () => {
    dispatch.app.onLogout().then(() => {
      message.success("退出成功");
      navigate("/user/login");
    });
  };

  return (
    <Layout className="page-basic" hasSider>
      <MenuCom data={userinfo.menus} collapsed={collapsed} />

      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={userinfo}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        {/* 普通面包屑导航 */}
        <Bread menus={userinfo.menus} />
        {/* Tab方式的导航 */}
        {/* <BreadTab
          menus={userinfo.menus}
          location={props.location}
          history={props.history}
        /> */}
        <Content className="content">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default BasicLayoutCom;

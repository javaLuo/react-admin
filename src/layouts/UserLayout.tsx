/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的第三方库
// ==================
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

// ==================
// 自定义的东西
// ==================
import "./UserLayout.less";

// ==================
// 组件
// ==================

import Footer from "../components/Footer";

const { Content } = Layout;

// ==================
// 类型声明
// ==================
import type { RootState } from "@/store";

// ==================
// 本组件
// ==================
export default function AppContainer(): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">
        <Outlet />
      </Content>
      <Footer className="user-layout" />
    </Layout>
  );
}

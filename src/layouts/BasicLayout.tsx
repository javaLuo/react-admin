/** 基础页面结构 - 有头部、底部、侧边导航 **/

// ==================
// 第三方库
// ==================
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { Layout, message } from "antd";

// ==================
// 自定义的东西
// ==================
import "./BasicLayout.less";

// ==================
// 组件
// ==================
import Header from "@/components/Header";
import MenuCom from "@/components/Menu";
import Footer from "@/components/Footer";
import Bread from "@/components/Bread";

const { Content } = Layout;

// ==================
// 类型声明
// ==================
import type { RootState, Dispatch } from "@/store";

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
        <Bread menus={userinfo.menus} />
        <Content className="content">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default BasicLayoutCom;

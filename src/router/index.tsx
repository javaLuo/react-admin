/** 根路由 **/

// ==================
// 第三方库
// ==================
import React, { useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import loadable from "@loadable/component";

// ==================
// 自定义的东西
// ==================
import tools from "@/util/tools";

// ==================
// 组件
// ==================
import { AuthNoLogin, AuthWithLogin, AuthNoPower } from "./AuthProvider";
import Loading from "../components/Loading";
import BasicLayout from "@/layouts/BasicLayout";
import UserLayout from "@/layouts/UserLayout";

// 全局提示只显示2秒
message.config({
  duration: 2,
});

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";

// ==================
// 异步加载各路由模块
// ==================
const [
  NotFound,
  NoPower,
  Login,
  Home,
  MenuAdmin,
  PowerAdmin,
  RoleAdmin,
  UserAdmin,
] = [
  () => import("../pages/ErrorPages/404"),
  () => import("../pages/ErrorPages/401"),
  () => import("../pages/Login"),
  () => import("../pages/Home"),
  () => import("../pages/System/MenuAdmin"),
  () => import("../pages/System/PowerAdmin"),
  () => import("../pages/System/RoleAdmin"),
  () => import("../pages/System/UserAdmin"),
].map((item) => {
  return loadable(item as any, {
    fallback: <Loading />,
  });
});

// ==================
// 本组件
// ==================
function RouterCom(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  useEffect(() => {
    const userTemp = sessionStorage.getItem("userinfo");
    /**
     * sessionStorage中有user信息，但store中没有
     * 说明刷新了页面，需要重新同步user数据到store
     * **/
    if (userTemp && !userinfo.userBasicInfo) {
      dispatch.app.setUserInfo(JSON.parse(tools.uncompile(userTemp)));
    }
  }, [dispatch.app, userinfo.userBasicInfo]);

  return (
    <Routes>
      <Route
        path="/user"
        element={
          <AuthWithLogin>
            <UserLayout />
          </AuthWithLogin>
        }
      >
        <Route path="/user" element={<Navigate to="login" />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="*" element={<Navigate to="login" />} />
      </Route>
      <Route
        path="/"
        element={
          <AuthNoLogin>
            <BasicLayout />
          </AuthNoLogin>
        }
      >
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />
        <Route
          path="system/menuadmin"
          element={
            <AuthNoPower>
              <MenuAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/poweradmin"
          element={
            <AuthNoPower>
              <PowerAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/roleadmin"
          element={
            <AuthNoPower>
              <RoleAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/useradmin"
          element={
            <AuthNoPower>
              <UserAdmin />
            </AuthNoPower>
          }
        />
        <Route path="404" element={<NotFound />} />
        <Route path="401" element={<NoPower />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  );
}

export default RouterCom;

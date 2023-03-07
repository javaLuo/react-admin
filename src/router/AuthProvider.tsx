// 路由守卫

import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import type { Menu } from "@/models/index.type";

import tools from "@/util/tools";

interface Props {
  children: JSX.Element;
}

// 未登录的用户，重定向到登录页
export function AuthNoLogin(props: Props) {
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  if (!userinfo.userBasicInfo) {
    return <Navigate to="/user/login" replace />;
  }

  return props.children;
}

// 已登录的用户，不应该进入login页，直接重定向到主页
export function AuthWithLogin(props: Props) {
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  if (userinfo.userBasicInfo) {
    return <Navigate to="/home" replace />;
  }
  return props.children;
}

// 已登录，但没有权限访问当前页面，跳401
export function AuthNoPower(props: Props) {
  const location = useLocation();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  // 判断当前用户是否有该路由权限，如果没有就跳转至401页
  const isHavePower = useMemo(() => {
    let menus: Menu[] = [];
    if (userinfo.menus && userinfo.menus.length) {
      menus = userinfo.menus;
    } else if (sessionStorage.getItem("userinfo")) {
      menus = JSON.parse(
        tools.uncompile(sessionStorage.getItem("userinfo") || "[]")
      ).menus;
    }
    const m: string[] = menus.map((item) => item.url); // 当前用户拥有的所有菜单

    if (m.includes(location.pathname)) {
      return true;
    }
    return false;
  }, [userinfo, location.pathname]);

  console.log("auth:", userinfo, isHavePower, location.pathname);

  if (!isHavePower && location.pathname !== "/401") {
    return <Navigate to="/401" replace />;
  }

  return props.children;
}

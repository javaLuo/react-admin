/** 根路由 **/

// ==================
// 第三方库
// ==================
import React, { useEffect, useCallback } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import {createBrowserHistory as createHistory} from "history"; // URL模式的history
import { createHashHistory as createHistory } from "history"; // 锚点模式的history
import { message } from "antd";

// ==================
// 自定义的东西
// ==================
import tools from "@/util/tools";

// ==================
// 组件
// ==================
import BasicLayout from "@/layouts/BasicLayout";
import UserLayout from "@/layouts/UserLayout";

// 全局提示只显示2秒
message.config({
  duration: 2,
});

const history = createHistory();

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";
import type { RouteComponentProps } from "react-router-dom";

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

  /** 跳转到某个路由之前触发 **/
  const onEnter = (Component: React.FC<any>, props: RouteComponentProps) => {
    const userTemp = sessionStorage.getItem("userinfo");
    if (userTemp) {
      return <Component {...props} />;
    }
    return <Redirect to="/user/login" />;
  };

  return (
    <Router history={history}>
      <Route
        render={(): JSX.Element => {
          return (
            <Switch>
              <Route path="/user" component={UserLayout} />
              <Route
                path="/"
                render={(props): JSX.Element => onEnter(BasicLayout, props)}
              />
            </Switch>
          );
        }}
      />
    </Router>
  );
}

export default RouterCom;

/** 根路由 **/
import React, { useEffect, useCallback } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import {createBrowserHistory as createHistory} from "history/"; // URL模式的history
import { createHashHistory as createHistory } from "history"; // 锚点模式的history
import tools from "@/util/tools";

/** 本页面所需页面级组件 **/
import BasicLayout from "@/layouts/BasicLayout";
import UserLayout from "@/layouts/UserLayout";
/** 普通组件 **/
import { message } from "antd";
// 全局提示只显示2秒
message.config({
  duration: 2,
});

const history = createHistory();

// ==================
// 本组件
// ==================
function RouterCom(props) {
  useEffect(() => {
    const userinfo = sessionStorage.getItem("userinfo");
    /**
     * sessionStorage中有user信息，但store中没有
     * 说明刷新了页面，需要重新同步user数据到store
     * **/
    if (userinfo && !props.userinfo.userBasicInfo) {
      props.setUserInfo(JSON.parse(tools.uncompile(userinfo)));
    }
  }, [props]);

  /** 跳转到某个路由之前触发 **/
  const onEnter = useCallback((Component, props) => {
    /**
     *  有用户信息，说明已登录
     *  没有，则跳转至登录页
     * **/
    const userinfo = sessionStorage.getItem("userinfo");
    if (userinfo) {
      return <Component {...props} />;
    }
    return <Redirect to="/user/login" />;
  }, []);

  return (
    <Router history={history}>
      <Route
        render={(props) => {
          return (
            <Switch>
              <Route path="/user" component={UserLayout} />
              <Route path="/" render={(props) => onEnter(BasicLayout, props)} />
            </Switch>
          );
        }}
      />
    </Router>
  );
}

export default connect(
  (state) => ({ userinfo: state.app.userinfo }),
  (dispatch) => ({
    setUserInfo: dispatch.app.setUserInfo,
  })
)(RouterCom);

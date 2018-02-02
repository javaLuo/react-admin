/** 根路由 **/
import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';        // 锚点模式的history
import { setUserInfo } from '../a_action/app-action';
import tools from '../util/tools';

/** 本页面所需页面级组件 **/
import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';

/** 普通组件 **/
import { message } from 'antd';
message.config({    // 全局提示只显示一秒
    duration: 1,
});

const history = createHistory();
@connect(
    (state) => ({
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ setUserInfo }, dispatch),
    })
)
export default class RootContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  /** 权限控制 **/
  onEnter(Component, props) {
      const userinfo = sessionStorage.getItem('userinfo');
      if (userinfo) {
          if (!this.props.userinfo) { // 说明刷新了页面，store中的用户信息丢失了，需要同步一下用户信息到store
              setTimeout(() => this.props.actions.setUserInfo(JSON.parse(tools.uncompile(userinfo))));
          }
         return <Component {...props} />;
      } else {
          return <Redirect to='/user/login' />;
      }
  }

  render() {
    return (
      <Router history={history}>
        <Route render={(props) => {
          return (
            <Switch>
              <Route path="/user" component={UserLayout} />
              <Route path="/" render={(props) => this.onEnter(BasicLayout, props)} />
            </Switch>
          );
        }}/>
      </Router>
    );
  }
}

// ==================
// PropTypes
// ==================

RootContainer.propTypes = {
  dispatch: P.func,
  children: P.any,
    actions: P.any,
    userinfo: P.any,
};

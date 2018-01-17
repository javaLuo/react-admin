/** 根路由 **/
import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';        // 锚点模式的history

/** 下面是代码不分割的用法 **/
import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';

/** 普通组件 **/
import css from './index.scss';

const history = createHistory();
@connect(
    (state) => ({
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)
export default class RootContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  /** 权限控制 **/
  onEnter(Component, props) {
    console.log('权限控制：', props);
    // 例子：如果没有登录，直接跳转至login页
    // if (sessionStorage.getItem('userInfo')) {
    //   return <Component {...props} />;
    // } else {
    //   return <Redirect to='/login' />;
    // }
    return <Component {...props}/>;
  }

  render() {
    return (
      <Router history={history}>
        <Route render={(props) => {
          return (
            <Switch>
              <Route path="/user" render={(props) => this.onEnter(UserLayout, props)} />
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
};

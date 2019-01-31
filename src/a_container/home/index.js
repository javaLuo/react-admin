/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";

// ==================
// 所需的所有组件
// ==================

import "./index.scss";
import ImgLogo from "../../assets/react-logo.jpg";

// ==================
// 本页面所需action
// ==================

import { test } from "../../a_action/app-action";

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({ test }, dispatch)
  })
)
export default class HomePageContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onTezt = () => {
    this.props.actions.test();
  };

  render() {
    return (
      <div className="page-home all_nowarp">
        <div className="box">
          <img src={ImgLogo} />
          <div className="title" onClick={this.onOpen}>
            React-admin
          </div>
          <div className="info">
            标准React+Redux分层结构，react16、router4、antd3、webpack4、ES6+
          </div>
          <div className="info" onClick={this.onTezt}>
            动态菜单配置，权限精确到按钮
          </div>
        </div>
      </div>
    );
  }
}

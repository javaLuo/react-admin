/* 401 没有权限 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "antd";
import P from "prop-types";
import "./index.scss";
import Img from "../../assets/error.gif";

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)
export default class NoPowerContainer extends React.Component {
  static propTypes = {
    history: P.any
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    setTimeout(() =>
      this.setState({
        show: true
      })
    );
  }

  onGoBackHome = () => {
    this.props.history.replace("/");
  };

  render() {
    return (
      <div className="page-error">
        <div>
          <div className="title">401</div>
          <div className="info">你没有访问该页面的权限</div>
          <div className="info">请联系你的管理员</div>
          <Button
            className="backBtn"
            type="primary"
            ghost
            onClick={this.onGoBackHome}
          >
            返回首页
          </Button>
        </div>
        <img src={Img + `?${new Date().getTime()}`} />
      </div>
    );
  }
}

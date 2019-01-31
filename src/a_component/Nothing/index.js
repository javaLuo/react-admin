/* Nothing 没有数据时的通用填充 */

import React from "react";
import P from "prop-types";
import "./index.scss";
import Img from "../../assets/nothing.png";

export default class Com extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="nothing">
        <img src={Img} alt="暂无数据" />
        {this.props.message || <div>暂无数据</div>}
      </div>
    );
  }
}

Com.propTypes = {
  message: P.any
};

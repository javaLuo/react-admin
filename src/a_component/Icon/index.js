/* 用于菜单的自定义图标 */
import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1688075_vwak21i2wxj.js"
});

export default class Icon extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <IconFont type={this.props.type} />;
  }
}

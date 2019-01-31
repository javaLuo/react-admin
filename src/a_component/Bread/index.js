/** 通用动态面包屑 **/
import React from "react";
import P from "prop-types";
import { Breadcrumb, Icon } from "antd";
import "./index.scss";

export default class Com extends React.PureComponent {
  static propTypes = {
    location: P.any,
    menus: P.array
  };

  /** 根据当前location动态生成对应的面包屑 **/
  makeBread(location, menus) {
    const paths = location.pathname.split("/").filter(item => !!item);
    const breads = [];
    paths.forEach((item, index) => {
      const temp = menus.find(v => v.url.replace(/^\//, "") === item);
      if (temp) {
        breads.push(
          <Breadcrumb.Item key={index}>{temp.title}</Breadcrumb.Item>
        );
      }
    });
    return breads;
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bread">
        <Icon className="icon" type="environment-o" />
        <Breadcrumb>
          {this.makeBread(this.props.location, this.props.menus)}
        </Breadcrumb>
      </div>
    );
  }
}

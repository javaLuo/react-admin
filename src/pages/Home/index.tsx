/* 主页 */

import React from "react";
import ImgLogo from "@/assets/react-logo.jpg";

import "./index.less";

export default function HomePageContainer(): JSX.Element {
  return (
    <div className="page-home all_nowarp">
      <div className="box">
        <img src={ImgLogo} />
        <div className="title">React-admin</div>
        <div className="info">
          标准React+Redux分层结构，react17、router4、antd4、webpack5、ES6+
        </div>
        <div className="info">动态菜单配置，权限精确到按钮</div>
      </div>
    </div>
  );
}

/* 主页 */

// ==================
// 所需的第三方库
// ==================
import React from "react";

// ==================
// 所需的自定义的东西
// ==================
import "./index.less";
import ImgLogo from "@/assets/react-logo.jpg";

export default function HomePageContainer() {
  return (
    <div className="page-home all_nowarp">
      <div className="box">
        <img src={ImgLogo} />
        <div className="title">React-admin</div>
        <div className="info">
          标准React+Redux分层结构，react16、router4、antd4、webpack4、ES6+
        </div>
        <div className="info">动态菜单配置，权限精确到按钮</div>
      </div>
    </div>
  );
}

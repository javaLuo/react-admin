/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React, { useState, useRef, useCallback } from "react";

// ==================
// 所需的所有组件
// ==================

import "./index.less";
import ImgLogo from "@/assets/react-logo.jpg";

export default function HomePageContainer() {
  const [count, setCount] = useState(0);
  const [height, setHeight] = useState(0);
  const ref1 = useRef();
  ref1.current = count;
  function handleAlertClick() {
    setTimeout(() => {
      alert(`count:${count}`);
    }, 3000);
  }

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div className="page-home all_nowarp" ref={measuredRef}>
      <div className="box">
        <img src={ImgLogo} />
        <div className="title" onClick={() => setCount(count + 1)}>
          {count}React-admin,height:{height}
        </div>
        <div className="info">标准React+Redux分层结构，react16、router4、antd4、webpack4、ES6+</div>
        <div className="info" onClick={() => handleAlertClick()}>
          动态菜单配置，权限精确到按钮
        </div>
      </div>
    </div>
  );
}

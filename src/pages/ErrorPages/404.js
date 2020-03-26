/* 404 NotFound */

import React from "react";
import { Button } from "antd";
import "./index.less";
import Img from "@/assets/error.gif";

export default function NotFoundContainer(props) {
  return (
    <div className="page-error">
      <div>
        <div className="title">404</div>
        <div className="info">Oh dear</div>
        <div className="info">这里什么也没有</div>
        <Button
          className="backBtn"
          type="primary"
          ghost
          onClick={props.history.replace("/")}
        >
          返回首页
        </Button>
      </div>
      <img src={Img + `?${new Date().getTime()}`} />
    </div>
  );
}

/* 404 NotFound */

import React from "react";
import { Button } from "antd";
import "./index.less";
import Img from "@/assets/error.gif";
import { History } from "history";

interface Props {
  history: History;
}

export default function NotFoundContainer(props: Props): JSX.Element {
  const gotoHome = (): void => {
    props.history.replace("/");
  };
  return (
    <div className="page-error">
      <div>
        <div className="title">404</div>
        <div className="info">Oh dear</div>
        <div className="info">这里什么也没有</div>
        <Button className="backBtn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={Img + `?${new Date().getTime()}`} />
    </div>
  );
}

/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.less";

const { Footer } = Layout;

export default function FooterCom(props) {
  return (
    <Footer className={`footer ${props.className}`}>
      © 2018-2020{" "}
      <a
        href="https://blog.isluo.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        blog.isluo.com
      </a>
      , Inc.
    </Footer>
  );
}

/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.scss";

const { Footer } = Layout;
export default class Com extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Footer className="footer">
        © 2018-2019{" "}
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
}

Com.propTypes = {};

/**
 * 子组件有任何报错都会传递到此
 * 用于页面异步加载出错时显示
 * 此组件只能用class的方式，因为hooks不支持getDerivedStateFromError 和 componentDidCatch
 */
import React from "react";
import { WarningOutlined } from "@ant-design/icons";
import "./index.less";

interface Props {
  location: Location;
  children: JSX.Element;
}
interface State {
  hasError: boolean;
}
export default class ErrorBoundary extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevP: Props) {
    if (prevP.location !== this.props.location) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <WarningOutlined className="error-icon" />
          <div>加载出错,请刷新页面</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** 左侧导航 **/
/**
 * static propTypes = {
    data: P.array, // 所有的菜单数据
    collapsed: P.bool, // 菜单咱开还是收起
    location: P.any
  };
 * */
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import "./index.less";
import ImgLogo from "@/assets/logo.png";
import Icon from "@/components/Icon";
import _ from "lodash";

const { Sider } = Layout;
const { SubMenu, Item } = Menu;
export default class MenuCom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceData: [], // 菜单数据（层级）
      treeDom: [], // 生成的菜单结构
      chosedKey: [], // 当前选中
      openKeys: [], // 当前需要被展开的项
    };
  }

  componentDidMount() {
    this.makeSourceData(this.props.data);
    this.nowChosed(this.props.location);
  }

  componentDidUpdate(prevP, prevS, snapshot) {
    console.log("数据不变的？", this.props.data, prevP.data);
    if (this.props.data !== prevP.data) {
      this.makeSourceData(this.props.data);
    }
    if (this.props.location !== prevP.location) {
      this.nowChosed(this.props.location);
    }
  }

  /** 处理当前选中 **/
  nowChosed(location) {
    const paths = location.pathname.split("/").filter((item) => !!item);
    this.setState({
      chosedKey: [location.pathname],
      openKeys: paths.map((item) => `/${item}`),
    });
  }

  /** 菜单展开和关闭时触发 **/
  onOpenChange(keys) {
    this.setState({
      openKeys: keys,
    });
  }
  onSelect = (e) => {
    console.log("被选中：", e);
    this.props.history.push(e.key);
  };

  /** 处理原始数据，将原始数据处理为层级关系 **/
  makeSourceData(data) {
    const d = _.cloneDeep(data);
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData = this.dataToJson(null, d) || [];
    const treeDom = this.makeTreeDom(sourceData, "");
    this.setState({
      sourceData,
      treeDom,
    });
  }

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  dataToJson(one, data) {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item) => !item.parent);
    } else {
      kids = data.filter((item) => item.parent === one.id);
    }
    kids.forEach((item) => (item.children = this.dataToJson(item, data)));
    return kids.length ? kids : null;
  }

  /** 构建树结构 **/
  makeTreeDom(data, key) {
    return data.map((item, index) => {
      const newKey = `${key}/${item.url.replace(/\//, "")}`;
      if (item.children) {
        return (
          <SubMenu
            key={newKey}
            title={
              !item.parent && item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              ) : (
                item.title
              )
            }>
            {this.makeTreeDom(item.children, newKey)}
          </SubMenu>
        );
      } else {
        return (
          <Item key={newKey}>
            {!item.parent && item.icon ? <Icon type={item.icon} /> : null}
            <span>{item.title}</span>
          </Item>
        );
      }
    });
  }

  render() {
    return (
      <Sider width={256} className="sider" trigger={null} collapsible collapsed={this.props.collapsed}>
        <div className={this.props.collapsed ? "menuLogo hide" : "menuLogo"}>
          <Link to="/">
            <img src={ImgLogo} />
            <div>React-Admin</div>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={this.state.chosedKey}
          {...(this.props.collapsed ? {} : { openKeys: this.state.openKeys })}
          onOpenChange={(e) => this.onOpenChange(e)}
          onSelect={this.onSelect}>
          {this.state.treeDom}
        </Menu>
      </Sider>
    );
  }
}

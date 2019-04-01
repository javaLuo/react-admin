/* Tree选择 - 菜单选择 - 单选 */
import React from "react";
import { Tree, Modal } from "antd";
import P from "prop-types";
import _ from "lodash";
import "./menuChose.scss";

const { TreeNode } = Tree;
export default class MenuChoseComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceData: [], // 原始数据，有层级关系
      nowData: undefined // 当前选中的节点信息
    };
  }

  componentDidMount() {
    this.makeSourceData(this.props.data);
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (this.props.data !== nextP.data) {
      this.makeSourceData(nextP.data);
    }
  }

  /** 处理原始数据，将原始数据处理为层级关系 **/
  makeSourceData(data) {
    const d = _.cloneDeep(data);
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData = this.dataToJson(null, d) || [];
    this.setState({
      sourceData
    });
  }

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  dataToJson(one, data) {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter(item => !item.parent);
    } else {
      kids = data.filter(item => item.parent === one.id);
    }
    kids.forEach(item => (item.children = this.dataToJson(item, data)));
    return kids.length ? kids : null;
  }

  /** 递归构建树结构 **/
  makeTreeDom(data) {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} data={item}>
            {this.makeTreeDom(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.title} key={item.id} data={item} />;
      }
    });
  }

  /** 树节点选中时触发 **/
  onTreeSelect = (keys, e) => {
    if (e.selected) {
      // 选中
      this.setState({
        nowData: e.node.props.data
      });
    } else {
      this.setState({
        nowData: undefined
      });
    }
  };

  /** 点击确定时触发 **/
  onOk = () => {
    this.props.onOk(this.state.nowData);
  };

  /** 点击关闭时触发 **/
  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        title={this.props.title || "请选择"}
        visible={this.props.visible}
        wrapClassName="menuTreeModal"
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <Tree
          defaultExpandedKeys={["0"]}
          defaultSelectedKeys={
            this.props.nowDataKey ? [this.props.nowDataKey] : []
          }
          onSelect={this.onTreeSelect}
        >
          <TreeNode title="根" key="0" data={{ title: "根", id: null }}>
            {this.makeTreeDom(this.state.sourceData)}
          </TreeNode>
        </Tree>
      </Modal>
    );
  }
}

MenuChoseComponent.propTypes = {
  data: P.array, // 原始数据
  title: P.string, // 标题
  visible: P.bool, // 是否显示
  nowDataKey: P.any, // 当前默认选中哪一个key
  onOk: P.func, // 确定
  onClose: P.func // 关闭
};

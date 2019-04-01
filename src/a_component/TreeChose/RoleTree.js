/* Tree选择 - 角色选择 - 多选 */
import React from "react";
import { Tree, Modal } from "antd";
import P from "prop-types";
import _ from "lodash";
import "./RoleTree.scss";

const { TreeNode } = Tree;
export default class RoleTreeComponent extends React.PureComponent {
  static propTypes = {
    data: P.array, // 原始数据
    title: P.string, // 标题
    visible: P.bool, // 是否显示
    defaultKeys: P.array, // 当前默认选中的key们
    loading: P.bool, // 确定按钮是否在等待中状态
    onOk: P.func, // 确定
    onClose: P.func // 关闭
  };

  constructor(props) {
    super(props);
    this.state = {
      sourceData: [], // 原始数据，有层级关系
      nowKeys: [] // 当前选中的keys
    };
  }

  componentDidMount() {
    this.makeSourceData(this.props.data);
  }

  UNSAFE_componentWillReceiveProps(nextP) {
    if (this.props.data !== nextP.data) {
      this.makeSourceData(nextP.data);
    }
    if (this.props.defaultKeys !== nextP.defaultKeys) {
      this.setState({
        nowKeys: nextP.defaultKeys.map(item => `${item}`)
      });
    }
  }

  /** 处理原始数据，将原始数据处理为层级关系 **/
  makeSourceData(data) {
    const d = _.cloneDeep(data);
    // 按照sort排序
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
          <TreeNode
            title={item.title}
            key={item.id}
            data={item}
            selectable={false}
          >
            {this.makeTreeDom(item.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            title={item.title}
            key={item.id}
            data={item}
            selectable={false}
          />
        );
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
    // 通过key返回指定的数据
    const res = this.props.data.filter(item => {
      return this.state.nowKeys.includes(`${item.id}`);
    });
    // 返回选中的keys和选中的具体数据
    this.props.onOk && this.props.onOk(this.state.nowKeys, res);
  };

  /** 点击关闭时触发 **/
  onClose = () => {
    this.props.onClose();
  };

  /** 选中或取消选中时触发 **/
  onCheck = keys => {
    this.setState({
      nowKeys: keys
    });
  };

  render() {
    return (
      <Modal
        title={this.props.title || "请选择"}
        visible={this.props.visible}
        wrapClassName="menuTreeModal"
        confirmLoading={this.props.loading}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <Tree
          checkable
          checkedKeys={this.state.nowKeys}
          onCheck={keys => this.onCheck(keys)}
          onSelect={this.onTreeSelect}
        >
          {this.makeTreeDom(this.state.sourceData)}
        </Tree>
      </Modal>
    );
  }
}

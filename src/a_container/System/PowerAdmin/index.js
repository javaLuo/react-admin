/** 权限管理页 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "./index.less";
// ==================
// 所需的所有组件
// ==================

import { Tree, Button, Table, Tooltip, Popconfirm, Modal, Form, Select, Input, InputNumber, message, Divider } from "antd";
import { EyeOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;

@connect(
  state => ({
    menus: state.sys.menus,
    powers: state.app.powers,
  }),
  dispatch => ({
    addPower: dispatch.sys.addPower,
    getMenus: dispatch.sys.getMenus,
    upPower: dispatch.sys.upPower,
    delPower: dispatch.sys.delPower,
    getPowerDataByMenuId: dispatch.sys.getPowerDataByMenuId,
  }),
)
export default class PowerAdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      data: [], // 当前所选菜单下的权限数据
      sourceData: [], // 所有的菜单数据（分层级）
      loading: false, // 页面主要数据是否正在加载中
      treeSelect: {}, // 当前Menu树被选中的节点数据
      nowData: null, // 当前选中的那条数据
      operateType: "add", // 操作类型 add新增，up修改, see查看
      modalShow: false, // 新增&修改 模态框是否显示
      modalLoading: false, // 新增&修改 模态框是否正在执行请求
      menuChoseShow: false, // 菜单选择树是否出现
      formParent: { label: undefined, value: undefined }, // 表单 - 当前所选菜单的值 { label, value }
    };
  }

  componentDidMount() {
    if (this.props.menus.length === 0) {
      this.getMenuData();
    } else {
      this.makeSourceData(this.props.menus);
    }
    this.getData();
  }

  componentDidUpdate(prevP) {
    if (prevP.menus !== this.props.menus) {
      this.makeSourceData(this.props.menus);
    }
  }

  /** 根据所选菜单id获取其下权限数据 **/
  getData(menuId = null) {
    const p = this.props.powers;
    if (!p.includes("power:query")) {
      return;
    }

    this.setState({
      loading: true,
    });
    const params = {
      menuId: Number(menuId) || null,
    };
    this.props
      .getPowerDataByMenuId(params)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data,
          });
        }
        this.setState({
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  /** 获取所有菜单数据 **/
  getMenuData() {
    this.props.getMenus();
  }

  /** 处理原始数据，将原始数据处理为层级关系 **/
  makeSourceData(data) {
    const d = _.cloneDeep(data);
    d.forEach(item => {
      item.key = String(item.id);
    });
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData = this.dataToJson(null, d) || [];
    this.setState({
      sourceData,
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
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={`${item.id}`} p={item.parent}>
            {this.makeTreeDom(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.title} key={`${item.id}`} id={item.id} p={item.parent} />;
      }
    });
  }

  /** 点击树目录时触发 **/
  onTreeSelect = (keys, e) => {
    console.log("key", keys, e);
    if (e.selected) {
      // 选中时才触发
      this.getData(keys[0]);
      this.setState({
        treeSelect: { title: e.node.title, id: e.node.id },
      });
    } else {
      this.setState({
        treeSelect: {},
        data: [],
      });
    }
  };

  /** 工具 - 根据parentID返回parentName **/
  getNameByParentId = id => {
    const p = this.state.data.find(item => item.id === id);
    return p ? p.title : undefined;
  };

  /** 新增&修改 模态框出现 **/
  onModalShow = (data, type) => {
    this.setState({
      modalShow: true,
      nowData: data,
      operateType: type,
      formParent: type === "add" ? { label: undefined, value: undefined } : { label: this.getNameByParentId(data.parent), value: data.parent },
    });

    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        this.form.current.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        // const v = form.getFieldsValue();
        this.form.current.setFieldsValue({
          formConditions: data.conditions,
          formDesc: data.desc,
          formCode: data.code,
          formSorts: data.sorts,
          formTitle: data.title,
        });
      }
    });
  };

  /** 新增&修改 模态框关闭 **/
  onClose = () => {
    this.setState({
      modalShow: false,
    });
  };

  /** 新增&修改 提交 **/
  async onOk() {
    try {
      const values = await this.form.current.validateFields();
      const params = {
        title: values.formTitle,
        code: values.formCode,
        menu: this.state.treeSelect.id,
        sorts: values.formSorts,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      this.setState({ modalLoading: true });
      if (this.state.operateType === "add") {
        // 新增
        this.props
          .addPower(params)
          .then(res => {
            if (res.status === 200) {
              message.success("添加成功");
              this.getData(this.state.treeSelect.id);
              this.onClose();
            } else {
              message.error("添加失败");
            }
            this.setState({ modalLoading: false });
          })
          .catch(() => {
            this.setState({ modalLoading: false });
          });
      } else {
        // 修改
        params.id = this.state.nowData.id;
        console.log("edit:", params);
        this.props
          .upPower(params)
          .then(res => {
            if (res.status === 200) {
              message.success("修改成功");
              this.getData(this.state.treeSelect.id);
              this.onClose();
            } else {
              message.error("修改失败");
            }
            this.setState({ modalLoading: false });
          })
          .catch(() => {
            this.setState({ modalLoading: false });
          });
      }
    } catch {
      // 未通过校验
    }
  }

  /** 删除一条数据 **/
  onDel = record => {
    const params = { id: record.id };
    this.setState({ loading: true });
    this.props.delPower(params).then(res => {
      if (res.status === 200) {
        this.getData(this.state.treeSelect.id);
        message.success("删除成功");
      } else {
        message.error(res.message);
      }
    });
  };

  /** 构建表格字段 **/
  makeColumns = () => {
    const columns = [
      {
        title: "序号",
        dataIndex: "serial",
        key: "serial",
      },
      {
        title: "权限名称",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "描述",
        dataIndex: "desc",
        key: "desc",
      },
      {
        title: "状态",
        dataIndex: "conditions",
        key: "conditions",
        render: (text, record) => (text === 1 ? <span style={{ color: "green" }}>启用</span> : <span style={{ color: "red" }}>禁用</span>),
      },
      {
        title: "操作",
        key: "control",
        width: 120,
        render: (text, record) => {
          let controls = [];
          const p = this.props.powers;
          p.includes("power:query") &&
            controls.push(
              <span key="0" className="control-btn green" onClick={() => this.onModalShow(record, "see")}>
                <Tooltip placement="top" title="查看">
                  <EyeOutlined />
                </Tooltip>
              </span>,
            );
          p.includes("power:up") &&
            controls.push(
              <span key="1" className="control-btn blue" onClick={() => this.onModalShow(record, "up")}>
                <Tooltip placement="top" title="修改">
                  <ToolOutlined />
                </Tooltip>
              </span>,
            );
          p.includes("power:del") &&
            controls.push(
              <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={() => this.onDel(record)}>
                <span className="control-btn red">
                  <Tooltip placement="top" title="删除">
                    <DeleteOutlined />
                  </Tooltip>
                </span>
              </Popconfirm>,
            );
          const result = [];
          controls.forEach((item, index) => {
            if (index) {
              result.push(<Divider key={`line${index}`} type="vertical" />);
            }
            result.push(item);
          });
          return result;
        },
      },
    ];
    return columns;
  };

  /** 构建表格数据 **/
  makeData(data) {
    if (!data) {
      return [];
    }
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        menu: item.menu,
        title: item.title,
        code: item.code,
        desc: item.desc,
        sorts: item.sorts,
        conditions: item.conditions,
        serial: index + 1,
      };
    });
  }

  render() {
    const p = this.props.powers;
    const formItemLayout = {
      // 表单布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <div className="page-power-admin">
        <div className="l">
          <div className="title">目录结构</div>
          <div>
            <Tree onSelect={this.onTreeSelect} treeData={this.state.sourceData}></Tree>
          </div>
        </div>
        <div className="r">
          <div className="searchBox">
            <ul>
              <li>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => this.onModalShow(null, "add")}
                  disabled={!(this.state.treeSelect.id && p.includes("power:add"))}>
                  {`添加${this.state.treeSelect.title || ""}权限`}
                </Button>
              </li>
            </ul>
          </div>
          <Table
            className={"diy-table"}
            columns={this.makeColumns()}
            loading={this.state.loading}
            dataSource={this.makeData(this.state.data)}
            pagination={{
              showQuickJumper: true,
              showTotal: (total, range) => `共 ${total} 条数据`,
            }}
          />
        </div>
        {/** 查看&新增&修改用户模态框 **/}
        <Modal
          title={`${{ add: "新增", up: "修改", see: "查看" }[this.state.operateType]}权限: ${this.state.treeSelect.title}->${this.state.nowData
            ?.title ?? ""}`}
          visible={this.state.modalShow}
          onOk={() => this.onOk()}
          onCancel={this.onClose}
          confirmLoading={this.state.modalLoading}>
          <Form ref={this.form} initialValues={{ formConditions: 1 }}>
            <Form.Item
              label="权限名"
              name="formTitle"
              {...formItemLayout}
              rules={[
                [
                  { required: true, whitespace: true, message: "必填" },
                  { max: 12, message: "最多输入12位字符" },
                ],
              ]}>
              <Input placeholder="请输入权限名" disabled={this.state.operateType === "see"} />
            </Form.Item>
            <Form.Item
              label="Code"
              name="formCode"
              {...formItemLayout}
              rules={[
                { required: true, whitespace: true, message: "必填" },
                { max: 12, message: "最多输入12位字符" },
              ]}>
              <Input placeholder="请输入权限Code" disabled={this.state.operateType === "see"} />
            </Form.Item>
            <Form.Item label="描述" name="formDesc" {...formItemLayout} rules={[{ max: 100, message: "最多输入100位字符" }]}>
              <TextArea rows={4} disabled={this.state.operateType === "see"} placeholoder="请输入描述" autosize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
            <Form.Item label="排序" name="formSorts" {...formItemLayout} rules={[{ required: true, message: "请输入排序号" }]}>
              <InputNumber min={0} max={99999} style={{ width: "100%" }} disabled={this.state.operateType === "see"} />
            </Form.Item>
            <Form.Item label="状态" name="formConditions" {...formItemLayout} rules={[{ required: true, message: "请选择状态" }]}>
              <Select disabled={this.state.operateType === "see"}>
                <Option key={1} value={1}>
                  启用
                </Option>
                <Option key={-1} value={-1}>
                  禁用
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

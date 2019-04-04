/** User 系统管理/用户管理 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import {
  Form,
  Button,
  Icon,
  Input,
  Table,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Divider,
  Select
} from "antd";
import "./index.scss";
import tools from "../../../util/tools"; // 工具

// ==================
// 所需的所有组件
// ==================

import RoleTree from "../../../a_component/TreeChose/RoleTree";

// ==================
// 本页面所需action
// ==================

import {
  getAllRoles,
  getRoles,
  addUser,
  upUser,
  delUser,
  setPowersByRoleId,
  findAllPowerByRoleId,
  getUserList,
  setUserRoles
} from "../../../a_action/sys-action";

// ==================
// Definition
// ==================
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(
  state => ({
    powerTreeData: state.sys.powerTreeData, // 权限树所需数据
    userinfo: state.app.userinfo, // 用户信息
    powers: state.app.powers // 所有的权限code
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getAllRoles,
        getRoles,
        addUser,
        upUser,
        delUser,
        setPowersByRoleId,
        findAllPowerByRoleId,
        getUserList,
        setUserRoles
      },
      dispatch
    )
  })
)
@Form.create()
export default class RoleAdminContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    userinfo: P.any,
    powers: P.array,
    form: P.any
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 当前页面全部数据
      roleData: [], // 所有的角色数据
      operateType: "add", // 操作类型 add新增，up修改, see查看
      loading: false, // 表格数据是否正在加载中
      searchUsername: undefined, // 搜索 - 角色名
      searchConditions: undefined, // 搜索 - 状态
      modalShow: false, // 添加/修改/查看 模态框是否显示
      modalLoading: false, // 添加/修改/查看 是否正在请求中
      nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
      roleTreeShow: false, // 角色树是否显示
      roleTreeDefault: [], // 用于菜单树，默认需要选中的项
      pageNum: 0, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
      treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
      treeOnOkLoading: false // 是否正在分配菜单
    };
  }

  componentDidMount() {
    this.onGetData(this.state.pageNum, this.state.pageSize);
    this.onGetRoleTreeData();
  }

  // 获取所有的角色数据 - 用于分配角色控件的原始数据
  onGetRoleTreeData() {
    this.props.actions.getAllRoles().then(res => {
      if (res.status === 200) {
        this.setState({
          roleData: res.data
        });
      }
    });
  }

  // 查询当前页面所需列表数据
  onGetData(pageNum, pageSize) {
    const p = this.props.powers;
    if (!p.includes("user:query")) {
      return;
    }

    const params = {
      pageNum,
      pageSize,
      username: this.state.searchUsername,
      conditions: this.state.searchConditions
    };
    this.setState({ loading: true });
    this.props.actions
      .getUserList(tools.clearNull(params))
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data.list,
            total: res.data.total,
            pageNum,
            pageSize
          });
        } else {
          message.error(res.message);
        }
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 搜索 - 名称输入框值改变时触发
  searchUsernameChange(e) {
    if (e.target.value.length < 20) {
      this.setState({
        searchUsername: e.target.value
      });
    }
  }

  // 搜索 - 状态下拉框选择时触发
  searchConditionsChange(v) {
    this.setState({
      searchConditions: v
    });
  }

  // 搜索
  onSearch() {
    this.onGetData(this.state.pageNum, this.state.pageSize);
  }

  /**
   * 添加/修改/查看 模态框出现
   * @item: 当前选中的那条数据
   * @type: add添加/up修改/see查看
   * **/
  onModalShow(data, type) {
    const { form } = this.props;

    if (type === "add") {
      // 新增，需重置表单各控件的值
      form.resetFields();
    } else {
      // 查看或修改，需设置表单各控件的值为当前所选中行的数据
      form.setFieldsValue({
        formConditions: data.conditions,
        formDesc: data.desc,
        formUsername: data.username,
        formPhone: data.phone,
        formEmail: data.email,
        formPassword: data.password
      });
    }
    this.setState({
      modalShow: true,
      nowData: data,
      operateType: type
    });
  }

  /** 模态框确定 **/
  onOk() {
    const me = this;
    const { form } = me.props;

    if (this.state.operateType === "see") {
      // 是查看
      this.onClose();
      return;
    }

    form.validateFields(
      [
        "formUsername",
        "formPassword",
        "formPhone",
        "formEmail",
        "formDesc",
        "formConditions"
      ],
      (err, values) => {
        if (err) {
          return false;
        }
        me.setState({ modalLoading: true });
        const params = {
          username: values.formUsername,
          password: values.formPassword,
          phone: values.formPhone,
          email: values.formEmail,
          desc: values.formDesc,
          conditions: values.formConditions
        };
        if (this.state.operateType === "add") {
          // 新增
          me.props.actions
            .addUser(params)
            .then(res => {
              if (res.status === 200) {
                message.success("添加成功");
                this.onGetData(this.state.pageNum, this.state.pageSize);
                this.onClose();
              } else {
                message.error(res.message);
              }
              me.setState({ modalLoading: false });
            })
            .catch(() => {
              me.setState({ modalLoading: false });
            });
        } else {
          // 修改
          params.id = this.state.nowData.id;
          me.props.actions
            .upUser(params)
            .then(res => {
              if (res.status === 200) {
                message.success("修改成功");
                this.onGetData(this.state.pageNum, this.state.pageSize);
                this.onClose();
              } else {
                message.error(res.message);
              }
              me.setState({ modalLoading: false });
            })
            .catch(() => {
              me.setState({ modalLoading: false });
            });
        }
      }
    );
  }

  // 删除某一条数据
  onDel(id) {
    this.setState({ loading: true });
    this.props.actions
      .delUser({ id })
      .then(res => {
        if (res.status === 200) {
          message.success("删除成功");
          this.onGetData(this.state.pageNum, this.state.pageSize);
        } else {
          message.error(res.message);
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  /** 模态框关闭 **/
  onClose() {
    this.setState({
      modalShow: false
    });
  }

  /** 分配角色按钮点击，权限控件出现 **/
  onTreeShowClick(record) {
    this.setState({
      nowData: record,
      roleTreeShow: true,
      roleTreeDefault: record.roles
    });
  }

  // 表单页码改变
  onTablePageChange(page, pageSize) {
    this.onGetData(page, pageSize);
  }

  // 构建字段
  makeColumns() {
    const columns = [
      {
        title: "序号",
        dataIndex: "serial",
        key: "serial"
      },
      {
        title: "用户名",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "描述",
        dataIndex: "desc",
        key: "desc"
      },
      {
        title: "状态",
        dataIndex: "conditions",
        key: "conditions",
        render: (text, record) =>
          text === 1 ? (
            <span style={{ color: "green" }}>启用</span>
          ) : (
            <span style={{ color: "red" }}>禁用</span>
          )
      },
      {
        title: "操作",
        key: "control",
        width: 200,
        render: (text, record) => {
          const controls = [];
          const u = this.props.userinfo || {};
          const p = this.props.powers;

          p.includes("user:query") &&
            controls.push(
              <span
                key="0"
                className="control-btn green"
                onClick={() => this.onModalShow(record, "see")}
              >
                <Tooltip placement="top" title="查看">
                  <Icon type="eye" />
                </Tooltip>
              </span>
            );
          p.includes("user:up") &&
            controls.push(
              <span
                key="1"
                className="control-btn blue"
                onClick={() => this.onModalShow(record, "up")}
              >
                <Tooltip placement="top" title="修改">
                  <Icon type="edit" />
                </Tooltip>
              </span>
            );
          p.includes("user:role") &&
            controls.push(
              <span
                key="2"
                className="control-btn blue"
                onClick={() => this.onTreeShowClick(record)}
              >
                <Tooltip placement="top" title="分配角色">
                  <Icon type="tool" />
                </Tooltip>
              </span>
            );

          p.includes("user:del") &&
            u.id !== record.id &&
            controls.push(
              <Popconfirm
                key="3"
                title="确定删除吗?"
                onConfirm={() => this.onDel(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <span className="control-btn red">
                  <Tooltip placement="top" title="删除">
                    <Icon type="delete" />
                  </Tooltip>
                </span>
              </Popconfirm>
            );

          const result = [];
          controls.forEach((item, index) => {
            if (index) {
              result.push(<Divider key={`line${index}`} type="vertical" />);
            }
            result.push(item);
          });
          return result;
        }
      }
    ];
    return columns;
  }

  // 构建table所需数据
  makeData(data) {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + this.state.pageNum * this.state.pageSize,
        username: item.username,
        password: item.password,
        phone: item.phone,
        email: item.email,
        desc: item.desc,
        conditions: item.conditions,
        control: item.id,
        roles: item.roles
      };
    });
  }

  // 分配角色确定
  onRoleOk(keys, objs) {
    const params = {
      id: this.state.nowData.id,
      roles: keys.map(item => Number(item))
    };
    this.setState({
      roleTreeLoading: true
    });
    this.props.actions
      .upUser(params)
      .then(res => {
        if (res.status === 200) {
          message.success("分配成功");
          this.onGetData(this.state.pageNum, this.state.pageSize);
          this.onRoleClose();
        } else {
          message.error(res.message);
        }
        this.setState({
          roleTreeLoading: false
        });
      })
      .catch(() => {
        this.setState({
          roleTreeLoading: false
        });
      });
  }
  // 分配角色树关闭
  onRoleClose() {
    this.setState({
      roleTreeShow: false
    });
  }
  render() {
    const me = this;
    const p = this.props.powers;
    const { form } = me.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    };

    return (
      <div>
        <div className="g-search">
          <ul className="search-func">
            <li>
              <Button
                type="primary"
                disabled={!p.includes("user:add")}
                onClick={() => this.onModalShow(null, "add")}
              >
                <Icon type="plus-circle-o" />
                添加用户
              </Button>
            </li>
          </ul>
          <Divider type="vertical" />
          {p.includes("user:query") && (
            <ul className="search-ul">
              <li>
                <Input
                  placeholder="请输入用户名"
                  onChange={e => this.searchUsernameChange(e)}
                  value={this.state.searchUsername}
                />
              </li>
              <li>
                <Select
                  placeholder="请选择状态"
                  allowClear
                  style={{ width: "200px" }}
                  onChange={e => this.searchConditionsChange(e)}
                  value={this.state.searchConditions}
                >
                  <Option value={1}>启用</Option>
                  <Option value={-1}>禁用</Option>
                </Select>
              </li>
              <li>
                <Button
                  icon="search"
                  type="primary"
                  onClick={() => this.onSearch()}
                >
                  搜索
                </Button>
              </li>
            </ul>
          )}
        </div>
        <div className="diy-table">
          <Table
            columns={this.makeColumns()}
            loading={this.state.loading}
            dataSource={this.makeData(this.state.data)}
            pagination={{
              total: this.state.total,
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              showQuickJumper: true,
              showTotal: (total, range) => `共 ${total} 条数据`,
              onChange: (page, pageSize) =>
                this.onTablePageChange(page, pageSize)
            }}
          />
        </div>
        {/* 新增&修改&查看 模态框 */}
        <Modal
          title={
            { add: "新增", up: "修改", see: "查看" }[this.state.operateType]
          }
          visible={this.state.modalShow}
          onOk={() => this.onOk()}
          onCancel={() => this.onClose()}
          confirmLoading={this.state.modalLoading}
        >
          <Form>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator("formUsername", {
                initialValue: undefined,
                rules: [
                  { required: true, whitespace: true, message: "必填" },
                  { max: 12, message: "最多输入12位字符" }
                ]
              })(
                <Input
                  placeholder="请输入用户名"
                  disabled={this.state.operateType === "see"}
                />
              )}
            </FormItem>
            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator("formPassword", {
                initialValue: undefined,
                rules: [
                  { required: true, whitespace: true, message: "必填" },
                  { min: 6, message: "最少输入6位字符" },
                  { max: 18, message: "最多输入18位字符" }
                ]
              })(
                <Input
                  type="password"
                  placeholder="请输入密码"
                  disabled={this.state.operateType === "see"}
                />
              )}
            </FormItem>
            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator("formPhone", {
                initialValue: undefined,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      const v = value;
                      if (v) {
                        if (!tools.checkPhone(v)) {
                          callback("请输入有效的手机号码");
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入手机号"
                  disabled={this.state.operateType === "see"}
                />
              )}
            </FormItem>
            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator("formEmail", {
                initialValue: undefined,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      const v = value;
                      if (v) {
                        if (!tools.checkEmail(v)) {
                          callback("请输入有效的邮箱地址");
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入邮箱地址"
                  disabled={this.state.operateType === "see"}
                />
              )}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator("formDesc", {
                initialValue: undefined,
                rules: [{ max: 100, message: "最多输入100个字符" }]
              })(
                <TextArea
                  rows={4}
                  disabled={this.state.operateType === "see"}
                  placeholoder="请输入描述"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator("formConditions", {
                initialValue: 1,
                rules: [{ required: true, message: "请选择状态" }]
              })(
                <Select disabled={this.state.operateType === "see"}>
                  <Option key={1} value={1}>
                    启用
                  </Option>
                  <Option key={-1} value={-1}>
                    禁用
                  </Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
        <RoleTree
          title={"分配角色"}
          data={this.state.roleData}
          visible={this.state.roleTreeShow}
          defaultKeys={this.state.roleTreeDefault}
          loading={this.state.roleTreeLoading}
          onOk={v => this.onRoleOk(v)}
          onClose={() => this.onRoleClose()}
        />
      </div>
    );
  }
}

/** Role 系统管理/角色管理 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import {
  Form,
  Button,
  Input,
  Table,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Divider,
  Select,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./index.less";
import tools from "@/util/tools"; // 工具

// ==================
// 所需的所有组件
// ==================

import TreeTable from "@/a_component/TreeChose/PowerTreeTable";

const { TextArea } = Input;
const { Option } = Select;
@connect(
  (state) => ({
    powersCode: state.app.powersCode,
    powerTreeData: state.sys.powerTreeData,
  }),
  (dispatch) => ({
    getAllPowers: dispatch.sys.getAllPowers,
    getRoles: dispatch.sys.getRoles,
    addRole: dispatch.sys.addRole,
    upRole: dispatch.sys.upRole,
    delRole: dispatch.sys.delRole,
    setPowersByRoleId: dispatch.sys.setPowersByRoleId,
    findAllPowerByRoleId: dispatch.sys.findAllPowerByRoleId,
    updateUserInfo: dispatch.app.updateUserInfo,
  })
)
export default class RoleAdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      data: [], // 当前页面全部数据
      operateType: "add", // 操作类型 add新增，up修改, see查看
      loading: false, // 表格数据是否正在加载中
      searchTitle: undefined, // 搜索 - 角色名
      searchConditions: undefined, // 搜索 - 状态
      modalShow: false, // 添加/修改/查看 模态框是否显示
      modalLoading: false, // 添加/修改/查看 是否正在请求中
      nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
      powerTreeShow: false, // 菜单树是否显示
      powerTreeDefault: { menus: [], powers: [] }, // 用于菜单树，默认需要选中的项
      pageNum: 1, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
      treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
      treeOnOkLoading: false, // 是否正在分配菜单
    };
  }

  componentDidMount() {
    this.onGetData(this.state.pageNum, this.state.pageSize);
    this.onGetPowerTreeData();
  }

  // 获取所有的菜单权限数据 - 用于分配权限控件的原始数据
  onGetPowerTreeData() {
    this.props.getAllPowers();
  }

  // 查询当前页面所需列表数据
  onGetData(pageNum, pageSize) {
    const p = this.props.powersCode;
    if (!p.includes("role:query")) {
      return;
    }

    const params = {
      pageNum,
      pageSize,
      title: this.state.searchTitle,
      conditions: this.state.searchConditions,
    };
    this.setState({ loading: true });
    this.props
      .getRoles(tools.clearNull(params))
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.list,
            total: res.data.total,
            pageNum,
            pageSize,
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
  searchTitleChange(e) {
    if (e.target.value.length < 20) {
      this.setState({
        searchTitle: e.target.value,
      });
    }
  }

  // 搜索 - 状态下拉框选择时触发
  searchConditionsChange(v) {
    this.setState({
      searchConditions: v,
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
    this.setState({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        this.form.current.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        this.form.current.setFieldsValue({
          formConditions: data.conditions,
          formDesc: data.desc,
          formSorts: data.sorts,
          formTitle: data.title,
        });
      }
    });
  }

  /** 模态框确定 **/
  async onOk() {
    if (this.state.operateType === "see") {
      this.onClose();
      return;
    }

    try {
      const me = this;
      const values = await this.form.current.validateFields();
      me.setState({ modalLoading: true });
      const params = {
        title: values.formTitle,
        desc: values.formDesc,
        sorts: values.formSorts,
        conditions: values.formConditions,
      };
      if (this.state.operateType === "add") {
        // 新增
        me.props
          .addRole(params)
          .then((res) => {
            if (res.status === 200) {
              message.success("添加成功");
              this.onGetData(this.state.pageNum, this.state.pageSize);
              this.props.updateUserInfo();
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
        me.props
          .upRole(params)
          .then((res) => {
            if (res.status === 200) {
              message.success("修改成功");
              this.onGetData(this.state.pageNum, this.state.pageSize);
              this.props.updateUserInfo();
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
    } catch {
      // 未通过校验
    }
  }

  // 删除某一条数据
  onDel(id) {
    this.setState({ loading: true });
    this.props
      .delRole({ id })
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功");
          this.onGetData(this.state.pageNum, this.state.pageSize);
          this.props.updateUserInfo();
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
      modalShow: false,
    });
  }

  /** 分配权限按钮点击，权限控件出现 **/
  onAllotPowerClick(record) {
    const menus = record.menuAndPowers.map((item) => item.menuId); // 需默认选中的菜单项ID
    const powers = record.menuAndPowers.reduce(
      (v1, v2) => [...v1, ...v2.powers],
      []
    ); // 需默认选中的权限ID
    this.setState({
      nowData: record,
      powerTreeShow: true,
      powerTreeDefault: { menus, powers },
    });
  }

  // 关闭菜单树
  onMenuTreeClose() {
    this.setState({
      powerTreeShow: false,
    });
  }

  // 菜单树确定 给角色分配菜单和权限
  onMenuTreeOk(arr) {
    const params = {
      id: this.state.nowData.id,
      menus: arr.menus,
      powers: arr.powers,
    };
    this.setState({
      treeOnOkLoading: true,
    });
    this.props
      .setPowersByRoleId(params)
      .then((res) => {
        if (res.status === 200) {
          this.onGetData(this.state.pageNum, this.state.pageSize);
          this.props.updateUserInfo();
          this.onMenuTreeClose();
        } else {
          message.error(res.message || "权限分配失败");
        }
        this.setState({
          treeOnOkLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          treeOnOkLoading: false,
        });
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
        key: "serial",
      },
      {
        title: "角色名",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "描述",
        dataIndex: "desc",
        key: "desc",
      },
      {
        title: "排序",
        dataIndex: "sorts",
        key: "sorts",
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
          ),
      },
      {
        title: "操作",
        key: "control",
        width: 200,
        render: (text, record) => {
          const controls = [];
          const p = this.props.powersCode;
          p.includes("role:query") &&
            controls.push(
              <span
                key="0"
                className="control-btn green"
                onClick={() => this.onModalShow(record, "see")}
              >
                <Tooltip placement="top" title="查看">
                  <EyeOutlined />
                </Tooltip>
              </span>
            );
          p.includes("role:up") &&
            controls.push(
              <span
                key="1"
                className="control-btn blue"
                onClick={() => this.onModalShow(record, "up")}
              >
                <Tooltip placement="top" title="修改">
                  <ToolOutlined />
                </Tooltip>
              </span>
            );
          p.includes("role:power") &&
            controls.push(
              <span
                key="2"
                className="control-btn blue"
                onClick={() => this.onAllotPowerClick(record)}
              >
                <Tooltip placement="top" title="分配权限">
                  <EditOutlined />
                </Tooltip>
              </span>
            );
          p.includes("role:del") &&
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
                    <DeleteOutlined />
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
        },
      },
    ];
    return columns;
  }

  // 构建table所需数据
  makeData(data) {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + (this.state.pageNum - 1) * this.state.pageSize,
        title: item.title,
        desc: item.desc,
        sorts: item.sorts,
        conditions: item.conditions,
        control: item.id,
        menuAndPowers: item.menuAndPowers,
      };
    });
  }

  render() {
    const p = this.props.powersCode;
    const formItemLayout = {
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
      <div>
        <div className="g-search">
          <ul className="search-func">
            <li>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                disabled={!p.includes("role:add")}
                onClick={() => this.onModalShow(null, "add")}
              >
                添加角色
              </Button>
            </li>
          </ul>
          <Divider type="vertical" />
          {p.includes("role:query") && (
            <ul className="search-ul">
              <li>
                <Input
                  placeholder="请输入角色名"
                  onChange={(e) => this.searchTitleChange(e)}
                  value={this.state.searchTitle}
                />
              </li>
              <li>
                <Select
                  placeholder="请选择状态"
                  allowClear
                  style={{ width: "200px" }}
                  onChange={(e) => this.searchConditionsChange(e)}
                  value={this.state.searchConditions}
                >
                  <Option value={1}>启用</Option>
                  <Option value={-1}>禁用</Option>
                </Select>
              </li>
              <li>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
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
                this.onTablePageChange(page, pageSize),
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
          <Form
            ref={this.form}
            initialValues={{
              formConditions: 1,
            }}
          >
            <Form.Item
              label="角色名"
              name="formTitle"
              {...formItemLayout}
              rules={[
                { required: true, whitespace: true, message: "必填" },
                { max: 12, message: "最多输入12位字符" },
              ]}
            >
              <Input
                placeholder="请输入角色名"
                disabled={this.state.operateType === "see"}
              />
            </Form.Item>
            <Form.Item
              label="描述"
              name="formDesc"
              {...formItemLayout}
              rules={[{ max: 100, message: "最多输入100个字符" }]}
            >
              <TextArea
                rows={4}
                disabled={this.state.operateType === "see"}
                placeholoder="请输入描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item
              label="排序"
              name="formSorts"
              {...formItemLayout}
              rules={[{ required: true, message: "请输入排序号" }]}
            >
              <InputNumber
                min={0}
                max={99999}
                style={{ width: "100%" }}
                disabled={this.state.operateType === "see"}
              />
            </Form.Item>
            <Form.Item
              label="状态"
              name="formConditions"
              {...formItemLayout}
              rules={[{ required: true, message: "请选择状态" }]}
            >
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
        <TreeTable
          title={
            this.state.nowData
              ? `分配权限：${this.state.nowData.title}`
              : "分配权限"
          }
          data={this.props.powerTreeData}
          defaultChecked={this.state.powerTreeDefault}
          initloading={this.state.treeLoading}
          loading={this.state.treeOnOkLoading}
          modalShow={this.state.powerTreeShow}
          onOk={(arr) => this.onMenuTreeOk(arr)}
          onClose={() => this.onMenuTreeClose()}
        />
      </div>
    );
  }
}

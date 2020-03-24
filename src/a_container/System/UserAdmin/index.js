/** User 系统管理/用户管理 **/

// ==================
// 所需的各种插件
// ==================

import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select } from "antd";
import { EyeOutlined, EditOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.less";
import tools from "@/util/tools"; // 工具

// ==================
// 所需的所有组件
// ==================

import RoleTree from "@/a_component/TreeChose/RoleTree";

const { TextArea } = Input;
const { Option } = Select;

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

function RoleAdminContainer(props) {
  const p = props.powersCode;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 数据正在加载中
  const [roleTreeLoading, setRoleTreeLoading] = useState(false); // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
  const [modalLoading, setModalLoading] = useState(false); // 添加/修改/查看 是否正在请求中
  const [data, setData] = useState([]); // 当前页面全部数据
  const [roleData, setRoleData] = useState([]); // 所有的角色数据

  // 模态框相关参数
  const [modalInfo, setModalInfo] = useState({
    operateType: "add", // 操作类型 add新增，up修改, see查看
    nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
    modalShow: false, // 添加/修改/查看 模态框是否显示
  });
  // 分页相关参数
  const [pageInfo, setPageInfo] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  // 角色树相关参数
  const [treeInfo, setTreeInfo] = useState({
    roleTreeShow: false, // 角色树是否显示
    roleTreeDefault: [], // 用于菜单树，默认需要选中的项
  });
  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useState({
    searchUsername: undefined, // 搜索 - 角色名
    searchConditions: undefined, // 搜索 - 状态
  });

  useEffect(
    function () {
      onGetDataCallback(pageInfo.pageNum, pageInfo.pageSize);
      onGetRoleTreeDataCallback();

      const arr = ["a", "b", "c"];
      const arr1 = [1, 2, 3];
      const b = arr.reduce((res, item, index) => {
        return [...res, { [item]: arr1[index] }];
      }, []);
    },
    [onGetDataCallback, onGetRoleTreeDataCallback, pageInfo],
  );

  // 获取所有的角色数据 - 用于分配角色控件的原始数据
  const onGetRoleTreeDataCallback = useCallback(onGetRoleTreeData);
  async function onGetRoleTreeData() {
    try {
      const res = await props.getAllRoles();
      if (res.status === 200) {
        setRoleData(res.data);
      }
    } catch {}
  }

  // 查询当前页面所需列表数据
  const onGetDataCallback = useCallback(onGetData);
  async function onGetData(pageNum, pageSize) {
    const p = props.powersCode;
    if (!p.includes("user:query")) {
      return;
    }

    const params = {
      pageNum,
      pageSize,
      username: searchInfo.searchUsername,
      conditions: searchInfo.searchConditions,
    };
    setLoading(true);
    try {
      const res = await props.getUserList(tools.clearNull(params));
      console.log("there?", res);
      if (res.status === 200) {
        setData(res.data.list);
        setPageInfo({
          pageNum,
          pageSize,
          total: res.data.total,
        });
      } else {
        message.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // 搜索 - 名称输入框值改变时触发
  function searchUsernameChange(e) {
    if (e.target.value.length < 20) {
      setSearchInfo({ ...searchInfo, searchUsername: e.target.value });
    }
  }

  // 搜索 - 状态下拉框选择时触发
  function searchConditionsChange(v) {
    setSearchInfo({ ...searchInfo, searchConditions: v });
  }

  // 搜索
  function onSearch() {
    onGetData(pageInfo.pageNum, pageInfo.pageSize);
  }

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  function onModalShow(data, type) {
    setModalInfo({
      ...modalInfo,
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        // 加setTimeout是因为：首次Model没加载，this.form.current不存在
        setTimeout(() => {
          form.setFieldsValue({
            formConditions: data.conditions,
            formDesc: data.desc,
            formUsername: data.username,
            formPhone: data.phone,
            formEmail: data.email,
            formPassword: data.password,
          });
        });
      }
    });
  }

  /** 模态框确定 **/
  async function onOk() {
    // 是查看
    if (modalInfo.operateType === "see") {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      const params = {
        username: values.formUsername,
        password: values.formPassword,
        phone: values.formPhone,
        email: values.formEmail,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      if (modalInfo.operateType === "add") {
        // 新增
        try {
          const res = await props.addUser(params);
          if (res.status === 200) {
            message.success("添加成功");
            onGetData(pageInfo.pageNum, pageInfo.pageSize);
            onClose();
          } else {
            message.error(res.message);
          }
        } finally {
          setModalLoading(false);
        }
      } else {
        // 修改
        params.id = modalInfo.nowData.id;
        try {
          const res = await props.upUser(params);
          if (res.status === 200) {
            message.success("修改成功");
            onGetData(pageInfo.pageNum, pageInfo.pageSize);
            onClose();
          } else {
            message.error(res.message);
          }
        } finally {
          setModalLoading(false);
        }
      }
    } catch {
      // 未通过校验
    }
  }

  // 删除某一条数据
  async function onDel(id) {
    setLoading(true);
    try {
      const res = await props.delUser({ id });
      if (res.status === 200) {
        message.success("删除成功");
        onGetData(pageInfo.pageNum, pageInfo.pageSize);
      } else {
        message.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  }

  /** 模态框关闭 **/
  function onClose() {
    setModalInfo({
      ...modalInfo,
      modalShow: false,
    });
  }

  /** 分配角色按钮点击，权限控件出现 **/
  function onTreeShowClick(record) {
    setModalInfo({
      ...modalInfo,
      nowData: record,
    });
    setTreeInfo({
      ...treeInfo,
      roleTreeShow: true,
      roleTreeDefault: record.roles || [],
    });
  }

  // 表单页码改变
  function onTablePageChange(page, pageSize) {
    onGetData(page, pageSize);
  }

  // 构建字段
  function makeColumns() {
    const columns = [
      {
        title: "序号",
        dataIndex: "serial",
        key: "serial",
      },
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
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
        width: 200,
        render: (text, record) => {
          const controls = [];
          const u = props.userinfo.userBasicInfo || {};
          const p = props.powersCode;

          p.includes("user:query") &&
            controls.push(
              <span key="0" className="control-btn green" onClick={() => onModalShow(record, "see")}>
                <Tooltip placement="top" title="查看">
                  <EyeOutlined />
                </Tooltip>
              </span>,
            );
          p.includes("user:up") &&
            controls.push(
              <span key="1" className="control-btn blue" onClick={() => onModalShow(record, "up")}>
                <Tooltip placement="top" title="修改">
                  <ToolOutlined />
                </Tooltip>
              </span>,
            );
          p.includes("user:role") &&
            controls.push(
              <span key="2" className="control-btn blue" onClick={() => onTreeShowClick(record)}>
                <Tooltip placement="top" title="分配角色">
                  <EditOutlined />
                </Tooltip>
              </span>,
            );

          p.includes("user:del") &&
            u.id !== record.id &&
            controls.push(
              <Popconfirm key="3" title="确定删除吗?" onConfirm={() => onDel(record.id)} okText="确定" cancelText="取消">
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
  }

  // 构建table所需数据
  function makeData(data) {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + (pageInfo.pageNum - 1) * pageInfo.pageSize,
        username: item.username,
        password: item.password,
        phone: item.phone,
        email: item.email,
        desc: item.desc,
        conditions: item.conditions,
        control: item.id,
        roles: item.roles,
      };
    });
  }

  // 分配角色确定
  async function onRoleOk(keys, objs) {
    const params = {
      id: modalInfo.nowData.id,
      roles: keys.map(item => Number(item)),
    };
    setRoleTreeLoading(true);
    try {
      const res = await props.upUser(params);
      if (res.status === 200) {
        message.success("分配成功");
        onGetData(pageInfo.pageNum, pageInfo.pageSize);
        onRoleClose();
      } else {
        message.error(res.message);
      }
    } finally {
      setRoleTreeLoading(false);
    }
  }

  // 分配角色树关闭
  function onRoleClose() {
    console.log("111");
    setTreeInfo({
      ...treeInfo,
      roleTreeShow: false,
    });
  }

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button type="primary" icon={<PlusCircleOutlined />} disabled={!p.includes("user:add")} onClick={() => onModalShow(null, "add")}>
              添加用户
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        {p.includes("user:query") && (
          <ul className="search-ul">
            <li>
              <Input placeholder="请输入用户名" onChange={e => searchUsernameChange(e)} value={searchInfo.searchUsername} />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={e => searchConditionsChange(e)}
                value={searchInfo.searchConditions}>
                <Option value={1}>启用</Option>
                <Option value={-1}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => onSearch()}>
                搜索
              </Button>
            </li>
          </ul>
        )}
      </div>
      <div className="diy-table">
        <Table
          columns={makeColumns()}
          loading={loading}
          dataSource={makeData(data)}
          pagination={{
            total: pageInfo.total,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条数据`,
            onChange: (page, pageSize) => onTablePageChange(page, pageSize),
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[modalInfo.operateType]}
        visible={modalInfo.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modalLoading}>
        <Form
          form={form}
          initialValues={{
            formConditions: 1,
          }}>
          <Form.Item
            label="用户名"
            name="formUsername"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}>
            <Input placeholder="请输入用户名" disabled={modalInfo.operateType === "see"} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="formPassword"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { min: 6, message: "最少输入6位字符" },
              { max: 18, message: "最多输入18位字符" },
            ]}>
            <Input type="password" placeholder="请输入密码" disabled={modalInfo.operateType === "see"} />
          </Form.Item>
          <Form.Item
            label="电话"
            name="formPhone"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkPhone(v)) {
                      return Promise.reject("请输入有效的手机号码");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}>
            <Input placeholder="请输入手机号" disabled={modalInfo.operateType === "see"} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="formEmail"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkEmail(v)) {
                      return Promise.reject("请输入有效的邮箱地址");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}>
            <Input placeholder="请输入邮箱地址" disabled={modalInfo.operateType === "see"} />
          </Form.Item>
          <Form.Item label="描述" name="formDesc" {...formItemLayout} rules={[{ max: 100, message: "最多输入100个字符" }]}>
            <TextArea rows={4} disabled={modalInfo.operateType === "see"} placeholoder="请输入描述" autosize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="状态" name="formConditions" {...formItemLayout} rules={[{ required: true, message: "请选择状态" }]}>
            <Select disabled={modalInfo.operateType === "see"}>
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
      <RoleTree
        title={"分配角色"}
        data={roleData}
        visible={treeInfo.roleTreeShow}
        defaultKeys={treeInfo.roleTreeDefault}
        loading={roleTreeLoading}
        onOk={v => onRoleOk(v)}
        onClose={() => onRoleClose()}
      />
    </div>
  );
}

export default connect(
  state => ({
    powerTreeData: state.sys.powerTreeData, // 权限树所需数据
    userinfo: state.app.userinfo, // 用户信息
    powersCode: state.app.powersCode, // 所有的权限code
  }),
  dispatch => ({
    getAllRoles: dispatch.sys.getAllRoles,
    addUser: dispatch.sys.addUser,
    upUser: dispatch.sys.upUser,
    delUser: dispatch.sys.delUser,
    getUserList: dispatch.sys.getUserList,
  }),
)(RoleAdminContainer);

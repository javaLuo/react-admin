/** User 系统管理/用户管理 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { Form, Button, Input, Table, message, Popconfirm, Modal, Tooltip, Divider, Select } from "antd";
import { EyeOutlined, EditOutlined, ToolOutlined, DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

// ==================
// 所需的自定义的东西
// ==================
import "./index.less";
import tools from "@/util/tools"; // 工具函数
import { usePage, useModal } from "@/hooks"; // 自定义的hooks

// ==================
// 所需的组件
// ==================
import RoleTree from "@/components/TreeChose/RoleTree";

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

// ==================
// 本组件
// ==================
function RoleAdminContainer(props) {
  const p = props.powersCode; // 用户拥有的所有权限code
  const [form] = Form.useForm();

  const [data, setData] = useState([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  const { pageNum, pageSize, total, setPage } = usePage(1, 10); // 分页相关参数控制
  const { operateType, nowData, modalShow, modalLoading, setModal } = useModal(); // 模态框相关参数控制

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useState({
    username: undefined, // 用户名
    conditions: undefined, // 状态
  });

  /**
   * 角色树相关参数
   * roleData 所有的角色数据
   * roleTreeLoading 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
   * roleTreeShow 角色树是否显示
   * roleTreeDefault 用于角色树，默认需要选中的项
   */
  const [roleData, setRoleData] = useState([]);
  const [roleTreeLoading, setRoleTreeLoading] = useState(false);
  const [roleTreeShow, setRoleTreeShow] = useState(false);
  const [roleTreeDefault, setRoleTreeDefault] = useState([]);

  // 副作用 - 首次加载组件时触发
  useEffect(() => {
    onGetData(pageNum, pageSize, 0);
    onGetRoleTreeData();
  }, []);

  // 函数 - 获取所有的角色数据 - 用于分配角色控件的原始数据
  const onGetRoleTreeData = useCallback(async () => {
    try {
      const res = await props.getAllRoles();
      if (res.status === 200) {
        setRoleData(res.data);
      }
    } catch {}
  }, [props]);

  // 函数 - 查询当前页面所需列表数据
  const onGetData = useCallback(
    async (pageNum, pageSize) => {
      const p = props.powersCode;
      if (!p.includes("user:query")) {
        return;
      }

      const params = {
        pageNum,
        pageSize,
        username: searchInfo.username,
        conditions: searchInfo.conditions,
      };
      setLoading(true);
      try {
        const res = await props.getUserList(tools.clearNull(params));
        if (res.status === 200) {
          setData(res.data.list);
          setPage({
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
    },
    [props, searchInfo, setPage]
  );

  // 搜索 - 名称输入框值改变时触发
  const searchUsernameChange = useCallback(
    (e) => {
      if (e.target.value.length < 20) {
        setSearchInfo({ ...searchInfo, username: e.target.value });
      }
    },
    [searchInfo]
  );

  // 搜索 - 状态下拉框选择时触发
  const searchConditionsChange = useCallback(
    (v) => {
      setSearchInfo({ ...searchInfo, conditions: v });
    },
    [searchInfo]
  );

  // 搜索
  const onSearch = useCallback(() => {
    onGetData(pageNum, pageSize, 2);
  }, [pageNum, pageSize, onGetData]);

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = useCallback(
    (data, type) => {
      setModal({
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
          form.setFieldsValue({
            formConditions: data.conditions,
            formDesc: data.desc,
            formUsername: data.username,
            formPhone: data.phone,
            formEmail: data.email,
            formPassword: data.password,
          });
        }
      });
    },
    [form, setModal]
  );

  /** 模态框确定 **/
  const onOk = useCallback(async () => {
    if (operateType === "see") {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      setModal({
        modalLoading: true,
      });
      const params = {
        username: values.formUsername,
        password: values.formPassword,
        phone: values.formPhone,
        email: values.formEmail,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      if (operateType === "add") {
        // 新增
        try {
          const res = await props.addUser(params);
          if (res.status === 200) {
            message.success("添加成功");
            onGetData(pageNum, pageSize);
            onClose();
          } else {
            message.error(res.message);
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        params.id = nowData.id;
        try {
          const res = await props.upUser(params);
          if (res.status === 200) {
            message.success("修改成功");
            onGetData(pageNum, pageSize);
            onClose();
          } else {
            message.error(res.message);
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      }
    } catch {
      // 未通过校验
    }
  }, [form, nowData, operateType, pageNum, pageSize, props, setModal, onClose, onGetData]);

  // 删除某一条数据
  const onDel = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const res = await props.delUser({ id });
        if (res.status === 200) {
          message.success("删除成功");
          onGetData(pageNum, pageSize);
        } else {
          message.error(res.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [pageNum, pageSize, props, onGetData]
  );

  /** 模态框关闭 **/
  const onClose = useCallback(() => {
    setModal({
      modalShow: false,
    });
  }, [setModal]);

  /** 分配角色按钮点击，角色控件出现 **/
  const onTreeShowClick = useCallback(
    (record) => {
      setModal({
        nowData: record,
      });
      setRoleTreeShow(true);
      setRoleTreeDefault(record.roles || []);
    },
    [setModal]
  );

  // 分配角色确定
  const onRoleOk = useCallback(
    async (keys, objs) => {
      const params = {
        id: nowData.id,
        roles: keys.map((item) => Number(item)),
      };
      setRoleTreeLoading(true);
      try {
        const res = await props.upUser(params);
        if (res.status === 200) {
          message.success("分配成功");
          onGetData(pageNum, pageSize);
          onRoleClose();
        } else {
          message.error(res.message);
        }
      } finally {
        setRoleTreeLoading(false);
      }
    },
    [nowData, pageNum, pageSize, props, onGetData, onRoleClose]
  );

  // 分配角色树关闭
  const onRoleClose = useCallback(() => {
    setRoleTreeShow(false);
  }, []);

  // 表单页码改变
  const onTablePageChange = useCallback(
    (page, pageSize) => {
      onGetData(page, pageSize, 4);
    },
    [onGetData]
  );

  // table字段
  const tableColumns = useMemo(() => {
    return [
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
              </span>
            );
          p.includes("user:up") &&
            controls.push(
              <span key="1" className="control-btn blue" onClick={() => onModalShow(record, "up")}>
                <Tooltip placement="top" title="修改">
                  <ToolOutlined />
                </Tooltip>
              </span>
            );
          p.includes("user:role") &&
            controls.push(
              <span key="2" className="control-btn blue" onClick={() => onTreeShowClick(record)}>
                <Tooltip placement="top" title="分配角色">
                  <EditOutlined />
                </Tooltip>
              </span>
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
  }, [props.powersCode, props.userinfo, onDel, onModalShow, onTreeShowClick]);

  // table列表所需数据
  const tableData = useMemo(() => {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + (pageNum - 1) * pageSize,
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
  }, [pageNum, pageSize, data]);

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
              <Input placeholder="请输入用户名" onChange={searchUsernameChange} value={searchInfo.username} />
            </li>
            <li>
              <Select placeholder="请选择状态" allowClear style={{ width: "200px" }} onChange={searchConditionsChange} value={searchInfo.conditions}>
                <Option value={1}>启用</Option>
                <Option value={-1}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
                搜索
              </Button>
            </li>
          </ul>
        )}
      </div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            total: total,
            current: pageNum,
            pageSize: pageSize,
            showQuickJumper: true,
            showTotal: (t, range) => `共 ${t} 条数据`,
            onChange: onTablePageChange,
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[operateType]}
        visible={modalShow}
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
            <Input placeholder="请输入用户名" disabled={operateType === "see"} />
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
            <Input type="password" placeholder="请输入密码" disabled={operateType === "see"} />
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
            <Input placeholder="请输入手机号" disabled={operateType === "see"} />
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
            <Input placeholder="请输入邮箱地址" disabled={operateType === "see"} />
          </Form.Item>
          <Form.Item label="描述" name="formDesc" {...formItemLayout} rules={[{ max: 100, message: "最多输入100个字符" }]}>
            <TextArea rows={4} disabled={operateType === "see"} placeholoder="请输入描述" autosize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="状态" name="formConditions" {...formItemLayout} rules={[{ required: true, message: "请选择状态" }]}>
            <Select disabled={operateType === "see"}>
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
        visible={roleTreeShow}
        defaultKeys={roleTreeDefault}
        loading={roleTreeLoading}
        onOk={onRoleOk}
        onClose={onRoleClose}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    powerTreeData: state.sys.powerTreeData, // 权限树所需数据
    userinfo: state.app.userinfo, // 用户信息
    powersCode: state.app.powersCode, // 所有的权限code
  }),
  (dispatch) => ({
    getAllRoles: dispatch.sys.getAllRoles,
    addUser: dispatch.sys.addUser,
    upUser: dispatch.sys.upUser,
    delUser: dispatch.sys.delUser,
    getUserList: dispatch.sys.getUserList,
  })
)(RoleAdminContainer);

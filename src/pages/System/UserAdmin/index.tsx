/** User 系统管理/用户管理 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";
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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// ==================
// 所需的自定义的东西
// ==================
import tools from "@/util/tools"; // 工具函数

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
// 所需的组件
// ==================
import RoleTree from "@/components/TreeChose/RoleTree";

// ==================
// 类型声明
// ==================
import {
  TableRecordData,
  Page,
  operateType,
  ModalType,
  SearchInfo,
  RoleTreeInfo,
  UserBasicInfoParam,
  Res,
  Props,
} from "./index.type";
import { RootState, Dispatch } from "@/store";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function UserAdminContainer(props: Props): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const powerTreeData = useSelector(
    (state: RootState) => state.sys.powerTreeData
  );
  const userinfo = useSelector((state: RootState) => state.app.userinfo);
  const p = useSelector((state: RootState) => state.app.powersCode);
  const [form] = Form.useForm();
  const [data, setData] = useState<TableRecordData[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  // 分页相关参数
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add", // see查看，add添加，up修改
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    username: undefined, // 用户名
    conditions: undefined, // 状态
  });

  // 角色树相关参数
  const [role, setRole] = useSetState<RoleTreeInfo>({
    roleData: [],
    roleTreeLoading: false,
    roleTreeShow: false,
    roleTreeDefault: [],
  });

  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData(page);
    getAllRolesData();
  });

  // 函数 - 获取所有的角色数据，用于分配角色控件的原始数据
  const getAllRolesData = async (): Promise<void> => {
    try {
      const res = await dispatch.sys.getAllRoles();
      if (res && res.status === 200) {
        setRole({
          roleData: res.data,
        });
      }
    } catch {}
  };

  // 函数 - 查询当前页面所需列表数据
  async function onGetData(page: {
    pageNum: number;
    pageSize: number;
  }): Promise<void> {
    if (!p.includes("user:query")) {
      return;
    }

    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      username: searchInfo.username,
      conditions: searchInfo.conditions,
    };
    setLoading(true);
    try {
      const res = await dispatch.sys.getUserList(tools.clearNull(params));
      if (res && res.status === 200) {
        setData(res.data.list);
        setPage({
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          total: res.data.total,
        });
      } else {
        message.error(res?.message ?? "数据获取失败");
      }
    } finally {
      setLoading(false);
    }
  }

  // 搜索 - 名称输入框值改变时触发
  const searchUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.value.length < 20) {
      setSearchInfo({ username: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchConditionsChange = (v: number): void => {
    setSearchInfo({ conditions: v });
  };

  // 搜索
  const onSearch = (): void => {
    onGetData(page);
  };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (
    data: TableRecordData | null,
    type: operateType
  ): void => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
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
  };

  /** 模态框确定 **/
  const onOk = async (): Promise<void> => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      setModal({
        modalLoading: true,
      });
      const params: UserBasicInfoParam = {
        username: values.formUsername,
        password: values.formPassword,
        phone: values.formPhone,
        email: values.formEmail,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      if (modal.operateType === "add") {
        // 新增
        try {
          const res: Res | undefined = await dispatch.sys.addUser(params);
          if (res && res.status === 200) {
            message.success("添加成功");
            onGetData(page);
            onClose();
          } else {
            message.error(res?.message ?? "操作失败");
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        params.id = modal.nowData?.id;
        try {
          const res: Res | undefined = await dispatch.sys.upUser(params);
          if (res && res.status === 200) {
            message.success("修改成功");
            onGetData(page);
            onClose();
          } else {
            message.error(res?.message ?? "操作失败");
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
  };

  // 删除某一条数据
  const onDel = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      const res = await dispatch.sys.delUser({ id });
      if (res && res.status === 200) {
        message.success("删除成功");
        onGetData(page);
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  /** 分配角色按钮点击，角色控件出现 **/
  const onTreeShowClick = (record: TableRecordData): void => {
    setModal({
      nowData: record,
    });
    setRole({
      roleTreeShow: true,
      roleTreeDefault: record.roles || [],
    });
  };

  // 分配角色确定
  const onRoleOk = async (keys: string[]): Promise<void> => {
    if (!modal.nowData?.id) {
      message.error("未获取到该条数据id");
      return;
    }
    const params = {
      id: modal.nowData.id,
      roles: keys.map((item) => Number(item)),
    };
    setRole({
      roleTreeLoading: true,
    });
    try {
      const res: Res = await dispatch.sys.setUserRoles(params);
      if (res && res.status === 200) {
        message.success("分配成功");
        onGetData(page);
        onRoleClose();
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setRole({
        roleTreeLoading: false,
      });
    }
  };

  // 分配角色树关闭
  const onRoleClose = (): void => {
    setRole({
      roleTreeShow: false,
    });
  };

  // 表格页码改变
  const onTablePageChange = (pageNum: number, pageSize: number): void => {
    onGetData({ pageNum, pageSize });
  };

  // ==================
  // 属性 和 memo
  // ==================

  // table字段
  const tableColumns = [
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
      render: (v: number): JSX.Element =>
        v === 1 ? (
          <span style={{ color: "green" }}>启用</span>
        ) : (
          <span style={{ color: "red" }}>禁用</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (v: null, record: TableRecordData) => {
        const controls = [];
        const u = userinfo.userBasicInfo || { id: -1 };
        p.includes("user:query") &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        p.includes("user:up") &&
          controls.push(
            <span
              key="1"
              className="control-btn blue"
              onClick={() => onModalShow(record, "up")}
            >
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        p.includes("user:role") &&
          controls.push(
            <span
              key="2"
              className="control-btn blue"
              onClick={() => onTreeShowClick(record)}
            >
              <Tooltip placement="top" title="分配角色">
                <EditOutlined />
              </Tooltip>
            </span>
          );

        p.includes("user:del") &&
          u.id !== record.id &&
          controls.push(
            <Popconfirm
              key="3"
              title="确定删除吗?"
              onConfirm={() => onDel(record.id)}
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

        const result: JSX.Element[] = [];
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

  // table列表所需数据
  const tableData = useMemo(() => {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + (page.pageNum - 1) * page.pageSize,
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
  }, [page, data]);

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!p.includes("user:add")}
              onClick={() => onModalShow(null, "add")}
            >
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
                onChange={searchUsernameChange}
                value={searchInfo.username}
              />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={searchConditionsChange}
                value={searchInfo.conditions}
              >
                <Option value={1}>启用</Option>
                <Option value={-1}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
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
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showQuickJumper: true,
            showTotal: (t, range) => `共 ${t} 条数据`,
            onChange: onTablePageChange,
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
        visible={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            formConditions: 1,
          }}
        >
          <Form.Item
            label="用户名"
            name="formUsername"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入用户名"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="formPassword"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { min: 6, message: "最少输入6位字符" },
              { max: 18, message: "最多输入18位字符" },
            ]}
          >
            <Input
              type="password"
              placeholder="请输入密码"
              disabled={modal.operateType === "see"}
            />
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
            ]}
          >
            <Input
              placeholder="请输入手机号"
              maxLength={11}
              disabled={modal.operateType === "see"}
            />
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
            ]}
          >
            <Input
              placeholder="请输入邮箱地址"
              disabled={modal.operateType === "see"}
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
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={modal.operateType === "see"}>
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
        data={role.roleData}
        visible={role.roleTreeShow}
        defaultKeys={role.roleTreeDefault}
        loading={role.roleTreeLoading}
        onOk={onRoleOk}
        onClose={onRoleClose}
      />
    </div>
  );
}

export default UserAdminContainer;

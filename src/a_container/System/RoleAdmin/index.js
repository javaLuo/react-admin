/** Role 系统管理/角色管理 **/

// ==================
// 所需的各种插件
// ==================

import React, { useState, useEffect, useCallback } from "react";
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

  const [data, setData] = useState([]); // 当前页面全部数据
  const [loading, setLoading] = useState(false); // 数据正在加载中
  const [treeOnOkLoading, setTreeOnOkLoading] = useState(false); // 是否正在分配菜单
  const [modalLoading, setModalLoading] = useState(false); // 添加/修改/查看 是否正在请求中
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
  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useState({
    searchTitle: undefined, // 搜索 - 角色名
    searchConditions: undefined, // 搜索 - 状态
  });

  // 角色树相关参数
  const [treeInfo, setTreeInfo] = useState({
    powerTreeShow: false, // 菜单树是否显示
    powerTreeDefault: { menus: [], powers: [] }, // 用于菜单树，默认需要选中的项
  });

  useEffect(() => {
    setLoading(true);
    onGetDataCallback(pageInfo.pageNum, pageInfo.pageSize);
    onGetPowerTreeDataCallback();
  }, [onGetDataCallback, onGetPowerTreeDataCallback, pageInfo]);

  // 获取所有的菜单权限数据 - 用于分配权限控件的原始数据
  const onGetPowerTreeDataCallback = useCallback(onGetPowerTreeData);
  function onGetPowerTreeData() {
    props.getAllPowers();
  }

  // 查询当前页面所需列表数据
  const onGetDataCallback = useCallback(onGetData);
  async function onGetData(pageNum, pageSize) {
    const p = props.powersCode;
    if (!p.includes("role:query")) {
      return;
    }
    const params = {
      pageNum,
      pageSize,
      title: searchInfo.searchTitle,
      conditions: searchInfo.searchConditions,
    };
    setLoading(true);
    try {
      const res = await props.getRoles(tools.clearNull(params));
      if (res.status === 200) {
        setData(res.data.list);
        setPageInfo({
          total: res.data.total,
          pageNum,
          pageSize,
        });
      } else {
        message.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // 搜索 - 名称输入框值改变时触发
  function searchTitleChange(e) {
    if (e.target.value.length < 20) {
      setSearchInfo({ ...searchInfo, searchTitle: e.target.value });
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
          formSorts: data.sorts,
          formTitle: data.title,
        });
      }
    });
  }

  /** 模态框确定 **/
  async function onOk() {
    if (modalInfo.operateType === "see") {
      onClose();
      return;
    }

    try {
      const values = await form.validateFields();
      setModalLoading(true);
      const params = {
        title: values.formTitle,
        desc: values.formDesc,
        sorts: values.formSorts,
        conditions: values.formConditions,
      };
      if (modalInfo.operateType === "add") {
        // 新增
        try {
          const res = await props.addRole(params);
          if (res.status === 200) {
            message.success("添加成功");
            onGetData(pageInfo.pageNum, pageInfo.pageSize);
            props.updateUserInfo();
            onClose();
          }
        } finally {
          setModalLoading(false);
        }
      } else {
        // 修改
        params.id = modalInfo.nowData.id;
        try {
          const res = await props.upRole(params);
          if (res.status === 200) {
            message.success("修改成功");
            onGetData(pageInfo.pageNum, pageInfo.pageSize);
            props.updateUserInfo();
            onClose();
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
      const res = await props.delRole({ id });
      if (res.status === 200) {
        message.success("删除成功");
        onGetData(pageInfo.pageNum, pageInfo.pageSize);
        props.updateUserInfo();
      } else {
        message.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  }

  /** 模态框关闭 **/
  function onClose() {
    setModalInfo({ ...modalInfo, modalShow: false });
  }

  /** 分配权限按钮点击，权限控件出现 **/
  function onAllotPowerClick(record) {
    const menus = record.menuAndPowers.map((item) => item.menuId); // 需默认选中的菜单项ID
    const powers = record.menuAndPowers.reduce(
      (v1, v2) => [...v1, ...v2.powers],
      []
    ); // 需默认选中的权限ID
    setModalInfo({ ...modalInfo, nowData: record });
    setTreeInfo({
      powerTreeShow: true,
      powerTreeDefault: { menus, powers },
    });
  }

  // 关闭菜单树
  function onMenuTreeClose() {
    setTreeInfo({ ...treeInfo, powerTreeShow: false });
  }

  // 菜单树确定 给角色分配菜单和权限
  async function onMenuTreeOk(arr) {
    const params = {
      id: modalInfo.nowData.id,
      menus: arr.menus,
      powers: arr.powers,
    };
    setTreeOnOkLoading(true);
    try {
      const res = await props.setPowersByRoleId(params);
      if (res.status === 200) {
        onGetData(pageInfo.pageNum, pageInfo.pageSize);
        props.updateUserInfo();
        onMenuTreeClose();
      } else {
        message.error(res.message || "权限分配失败");
      }
    } finally {
      setTreeOnOkLoading(false);
    }
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
          const p = props.powersCode;
          p.includes("role:query") &&
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
          p.includes("role:up") &&
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
          p.includes("role:power") &&
            controls.push(
              <span
                key="2"
                className="control-btn blue"
                onClick={() => onAllotPowerClick(record)}
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
        title: item.title,
        desc: item.desc,
        sorts: item.sorts,
        conditions: item.conditions,
        control: item.id,
        menuAndPowers: item.menuAndPowers,
      };
    });
  }

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!p.includes("role:add")}
              onClick={() => onModalShow(null, "add")}
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
                onChange={(e) => searchTitleChange(e)}
                value={searchInfo.searchTitle}
              />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={(e) => searchConditionsChange(e)}
                value={searchInfo.searchConditions}
              >
                <Option value={1}>启用</Option>
                <Option value={-1}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => onSearch()}
              >
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
        onOk={() => onOk()}
        onCancel={() => onClose()}
        confirmLoading={modalLoading}
      >
        <Form
          form={form}
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
              disabled={modalInfo.operateType === "see"}
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
              disabled={modalInfo.operateType === "see"}
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
              disabled={modalInfo.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
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
      <TreeTable
        title={
          modalInfo.nowData
            ? `分配权限：${modalInfo.nowData.title}`
            : "分配权限"
        }
        data={props.powerTreeData}
        defaultChecked={treeInfo.powerTreeDefault}
        loading={treeOnOkLoading}
        modalShow={treeInfo.powerTreeShow}
        onOk={(arr) => onMenuTreeOk(arr)}
        onClose={() => onMenuTreeClose()}
      />
    </div>
  );
}

export default connect(
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
)(RoleAdminContainer);

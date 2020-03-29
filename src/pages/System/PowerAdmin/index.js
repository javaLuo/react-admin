/** 权限管理页 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import {
  Tree,
  Button,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Divider,
  Checkbox,
} from "antd";
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import _ from "lodash";

// ==================
// 所需的自定义的东西
// ==================
import "./index.less";
import { useModal } from "@/hooks"; // 自定义的hooks

const { Option } = Select;
const { TextArea } = Input;

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
function PowerAdminContainer(props) {
  const p = props.powersCode; // 用户拥有的所有权限code
  const [form] = Form.useForm();

  const [data, setData] = useState([]); // 当前所选菜单下的权限数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  const {
    operateType,
    nowData,
    modalShow,
    modalLoading,
    setModal,
  } = useModal(); // 模态框相关参数控制
  const [rolesCheckboxChose, setRolesCheckboxChose] = useState([]); // 表单 - 赋予项选中的值

  /**
   * 左侧菜单树相关参数
   * treeSelect 当前Menu树被选中的节点数据
   */
  const [treeSelect, setTreeSelect] = useState({});

  useEffect(() => {
    if (props.userinfo.menus.length === 0) {
      props.getMenus();
    }
    props.getAllRoles();
    getData();
  }, []);

  /** 根据所选菜单id获取其下权限数据 **/
  const getData = useCallback(
    async (menuId = null) => {
      const p = props.powersCode;
      if (!p.includes("power:query")) {
        return;
      }

      setLoading(true);
      const params = {
        menuId: Number(menuId) || null,
      };

      try {
        const res = await props.getPowerDataByMenuId(params);

        if (res.status === 200) {
          setData(res.data);
        }
      } finally {
        setLoading(false);
      }
    },
    [props]
  );

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  const dataToJson = useCallback((one, data) => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item) => !item.parent);
    } else {
      kids = data.filter((item) => item.parent === one.id);
    }
    kids.forEach((item) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : null;
  }, []);

  /** 点击树目录时触发 **/
  const onTreeSelect = useCallback(
    (keys, e) => {
      if (e.selected) {
        // 选中时才触发
        getData(keys[0]);
        setTreeSelect({ title: e.node.title, id: e.node.id });
      } else {
        setTreeSelect({});
        setData([]);
      }
    },
    [getData]
  );

  /** 新增&修改 模态框出现 **/
  const onModalShow = useCallback(
    (data, type) => {
      setModal({
        modalShow: true,
        nowData: data,
        operateType: type,
      });
      console.log("props:", props.roles);
      setRolesCheckboxChose(
        data && data.id
          ? props.roles
              .filter((item) => {
                const theMenuPower = item.menuAndPowers?.find(
                  (item2) => item2.menuId === data.menu
                );
                if (theMenuPower) {
                  return theMenuPower.powers.includes(data.id);
                }
                return false;
              })
              .map((item) => item.id)
          : []
      );
      setTimeout(() => {
        if (type === "add") {
          // 新增，需重置表单各控件的值
          form.resetFields();
        } else {
          // 查看或修改，需设置表单各控件的值为当前所选中行的数据
          // const v = form.getFieldsValue();
          form.setFieldsValue({
            formConditions: data.conditions,
            formDesc: data.desc,
            formCode: data.code,
            formSorts: data.sorts,
            formTitle: data.title,
          });
        }
      });
    },
    [form, props.roles, setModal]
  );

  /** 新增&修改 模态框关闭 **/
  const onClose = useCallback(() => {
    setModal({
      modalShow: false,
    });
  }, [setModal]);

  /** 新增&修改 提交 **/
  const onOk = useCallback(async () => {
    if (operateType === "see") {
      onClose();
      return;
    }

    try {
      const values = await form.validateFields();
      const params = {
        title: values.formTitle,
        code: values.formCode,
        menu: treeSelect.id,
        sorts: values.formSorts,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      setModal({
        modalLoading: true,
      });
      if (operateType === "add") {
        // 新增
        try {
          const res = await props.addPower(params);
          if (res.status === 200) {
            message.success("添加成功");
            getData(treeSelect.id);
            onClose();

            await setPowersByRoleIds(res.data.id, rolesCheckboxChose);
            props.updateUserInfo();
            props.getAllRoles();
          } else {
            message.error("添加失败");
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        try {
          params.id = nowData.id;
          const res = await props.upPower(params);
          if (res.status === 200) {
            message.success("修改成功");
            getData(treeSelect.id);
            onClose();

            await setPowersByRoleIds(params.id, rolesCheckboxChose);
            props.getAllRoles();
            props.updateUserInfo();
          } else {
            message.error("修改失败");
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
  }, [
    form,
    nowData,
    operateType,
    rolesCheckboxChose,
    props,
    getData,
    onClose,
    treeSelect.id,
    setModal,
    setPowersByRoleIds,
  ]);

  /** 删除一条数据 **/
  const onDel = useCallback(
    async (record) => {
      const params = { id: record.id };
      setLoading(true);
      const res = await props.delPower(params);
      if (res.status === 200) {
        getData(treeSelect.id);
        props.updateUserInfo();
        message.success("删除成功");
      } else {
        message.error(res.message);
      }
    },
    [props, getData, treeSelect.id]
  );

  /**
   * 批量更新roles
   * @param id 当前这个权限的id
   * @param roleIds 选中的角色的id们，要把当前权限赋给这些角色
   *  **/
  const setPowersByRoleIds = useCallback(
    (id, roleIds) => {
      const params = props.roles.map((item) => {
        const powersTemp = new Set(
          item.menuAndPowers.reduce((a, b) => [...a, ...b.powers], [])
        );
        if (roleIds.includes(item.id)) {
          powersTemp.add(id);
        } else {
          powersTemp.delete(id);
        }
        return {
          id: item.id,
          menus: item.menuAndPowers.map((item) => item.menuId),
          powers: Array.from(powersTemp),
        };
      });
      props.setPowersByRoleIds(params);
    },
    [props]
  );

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const sourceData = useMemo(() => {
    const d = _.cloneDeep(props.userinfo.menus);
    d.forEach((item) => {
      item.key = String(item.id);
    });
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    return dataToJson(null, d) || [];
  }, [props.userinfo.menus, dataToJson]);

  /** 构建表格字段 **/
  const tableColumns = useMemo(() => {
    return [
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
        width: 120,
        render: (text, record) => {
          const controls = [];
          const p = props.powersCode;
          p.includes("power:query") &&
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
          p.includes("power:up") &&
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
          p.includes("power:del") &&
            controls.push(
              <Popconfirm
                key="2"
                title="确定删除吗?"
                okText="确定"
                cancelText="取消"
                onConfirm={() => onDel(record)}
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
  }, [props.powersCode, onDel, onModalShow]);

  /** 构建表格数据 **/
  const tableData = useMemo(() => {
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
  }, [data]);

  /** 新增或修改时 构建‘赋予’项数据 **/
  const rolesCheckboxData = useMemo(() => {
    return props.roles.map((item) => ({
      label: item.title,
      value: item.id,
    }));
  }, [props.roles]);

  // 赋予相关角色改变
  const onRolesCheckboxChange = useCallback((values) => {
    setRolesCheckboxChose(values);
  }, []);

  return (
    <div className="page-power-admin">
      <div className="l">
        <div className="title">目录结构</div>
        <div>
          <Tree onSelect={onTreeSelect} treeData={sourceData}></Tree>
        </div>
      </div>
      <div className="r">
        <div className="searchBox">
          <ul>
            <li>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => onModalShow(null, "add")}
                disabled={!(treeSelect.id && p.includes("power:add"))}
              >
                {`添加${treeSelect.title || ""}权限`}
              </Button>
            </li>
          </ul>
        </div>
        <Table
          className="diy-table"
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条数据`,
          }}
        />
      </div>
      {/** 查看&新增&修改用户模态框 **/}
      <Modal
        title={`${{ add: "新增", up: "修改", see: "查看" }[operateType]}权限: ${
          treeSelect.title
        }->${nowData?.title ?? ""}`}
        visible={modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modalLoading}
      >
        <Form form={form} initialValues={{ formConditions: 1 }}>
          <Form.Item
            label="权限名"
            name="formTitle"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入权限名"
              disabled={operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="Code"
            name="formCode"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入权限Code"
              disabled={operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="formDesc"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100位字符" }]}
          >
            <TextArea
              rows={4}
              disabled={operateType === "see"}
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
              disabled={operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={operateType === "see"}>
              <Option key={1} value={1}>
                启用
              </Option>
              <Option key={-1} value={-1}>
                禁用
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="赋予" {...formItemLayout}>
            <Checkbox.Group
              disabled={operateType === "see"}
              options={rolesCheckboxData}
              value={rolesCheckboxChose}
              onChange={onRolesCheckboxChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
    powersCode: state.app.powersCode,
    roles: state.sys.roles,
  }),
  (dispatch) => ({
    addPower: dispatch.sys.addPower,
    getMenus: dispatch.sys.getMenus,
    upPower: dispatch.sys.upPower,
    delPower: dispatch.sys.delPower,
    getPowerDataByMenuId: dispatch.sys.getPowerDataByMenuId,
    updateUserInfo: dispatch.app.updateUserInfo,
    setPowersByRoleIds: dispatch.sys.setPowersByRoleIds,
    getAllRoles: dispatch.sys.getAllRoles,
  })
)(PowerAdminContainer);

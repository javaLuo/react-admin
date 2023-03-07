/** 权限管理页 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback, useMemo } from "react";

import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";
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
import { cloneDeep } from "lodash";

// ==================
// 自定义的东西
// ==================
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
// 类型声明
// ==================
import {
  TableRecordData,
  ModalType,
  operateType,
  Menu,
  Power,
  PowerParam,
  Res,
  TreeSourceData,
} from "./index.type";
import { RootState, Dispatch } from "@/store";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import type { EventDataNode, DataNode } from "rc-tree/lib/interface";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function PowerAdminContainer() {
  const dispatch = useDispatch<Dispatch>();
  const p = useSelector((state: RootState) => state.app.powersCode);
  const roles = useSelector((state: RootState) => state.sys.roles);
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  const [form] = Form.useForm();
  const [data, setData] = useState<Power[]>([]); // 当前所选菜单下的权限数据
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });
  const [rolesCheckboxChose, setRolesCheckboxChose] = useState<number[]>([]); // 表单 - 赋予项选中的值

  // 左侧菜单树相关参数 当前Menu树被选中的节点数据
  const [treeSelect, setTreeSelect] = useState<{ title?: string; id?: number }>(
    {}
  );

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    if (userinfo.menus.length === 0) {
      dispatch.sys.getMenus();
    }
    dispatch.sys.getAllRoles();
    getData();
  });

  // 根据所选菜单id获取其下权限数据
  const getData = async (menuId: string | number | null = null) => {
    if (!p.includes("power:query")) {
      return;
    }

    setLoading(true);
    const params = {
      menuId: Number(menuId) || null,
    };

    try {
      const res: Res = await dispatch.sys.getPowerDataByMenuId(params);

      if (res && res.status === 200) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback(
    (one: TreeSourceData | null, data: TreeSourceData[]) => {
      let kids: TreeSourceData[];
      if (!one) {
        // 第1次递归
        kids = data.filter((item: TreeSourceData) => !item.parent);
      } else {
        kids = data.filter((item: TreeSourceData) => item.parent === one.id);
      }
      kids.forEach(
        (item: TreeSourceData) => (item.children = dataToJson(item, data))
      );
      return kids.length ? kids : undefined;
    },
    []
  );

  // 工具 - 赋值Key
  const makeKey = useCallback((data: Menu[]) => {
    const newData: TreeSourceData[] = [];
    for (let i = 0; i < data.length; i++) {
      const item: any = { ...data[i] };
      if (item.children) {
        item.children = makeKey(item.children);
      }
      const treeItem: TreeSourceData = {
        ...(item as TreeSourceData),
        key: item.id,
      };
      newData.push(treeItem);
    }
    return newData;
  }, []);

  // 点击树目录时触发
  const onTreeSelect = (
    keys: React.Key[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<DataNode> & { id: number; title: string };
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => {
    if (info.selected) {
      // 选中时才触发
      getData(keys[0]);
      setTreeSelect({
        title: info.node.title,
        id: info.node.id,
      });
    } else {
      setTreeSelect({});
      setData([]);
    }
  };

  // 新增&修改 模态框出现
  const onModalShow = (data: TableRecordData | null, type: operateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setRolesCheckboxChose(
      data && data.id
        ? roles
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
        form.setFieldsValue({
          formConditions: data?.conditions,
          formDesc: data?.desc,
          formCode: data?.code,
          formSorts: data?.sorts,
          formTitle: data?.title,
        });
      }
    });
  };

  // 新增&修改 模态框关闭
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  // 新增&修改 提交
  const onOk = async () => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }

    try {
      const values = await form.validateFields();
      const params: PowerParam = {
        title: values.formTitle,
        code: values.formCode,
        menu: treeSelect.id || 0,
        sorts: values.formSorts,
        desc: values.formDesc,
        conditions: values.formConditions,
      };
      setModal({
        modalLoading: true,
      });
      if (modal.operateType === "add") {
        // 新增
        try {
          const res: Res = await dispatch.sys.addPower(params);
          if (res && res.status === 200) {
            message.success("添加成功");
            getData(treeSelect.id);
            onClose();

            await setPowersByRoleIds(res.data.id, rolesCheckboxChose);
            dispatch.app.updateUserInfo(null);
            dispatch.sys.getAllRoles();
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
          if (!modal?.nowData?.id) {
            message.error("该数据没有ID");
            return;
          }
          params.id = modal.nowData.id;

          const res: Res = await dispatch.sys.upPower(params);
          if (res && res.status === 200) {
            message.success("修改成功");
            getData(treeSelect.id);
            onClose();

            await setPowersByRoleIds(params.id, rolesCheckboxChose);
            dispatch.sys.getAllRoles();
            dispatch.app.updateUserInfo(null);
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
  };

  // 删除一条数据
  const onDel = async (record: TableRecordData) => {
    const params = { id: record.id };
    setLoading(true);
    const res = await dispatch.sys.delPower(params);
    if (res && res.status === 200) {
      getData(treeSelect.id);
      dispatch.app.updateUserInfo(null);
      message.success("删除成功");
    } else {
      message.error(res?.message ?? "操作失败");
    }
  };

  /**
   * 批量更新roles
   * @param id 当前这个权限的id
   * @param roleIds 选中的角色的id们，要把当前权限赋给这些角色
   *  **/
  const setPowersByRoleIds = (id: number, roleIds: number[]) => {
    const params = roles.map((item) => {
      const powersTemp = new Set(
        item.menuAndPowers.reduce((a, b) => [...a, ...b.powers], [] as number[])
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
    dispatch.sys.setPowersByRoleIds(params);
  };

  // ==================
  // 属性 和 memo
  // ==================

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData: TreeSourceData[] = useMemo(() => {
    const menuData: Menu[] = cloneDeep(userinfo.menus);

    // 这应该递归，把children数据也赋值key
    const d: TreeSourceData[] = makeKey(menuData);

    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    return dataToJson(null, d) || ([] as TreeSourceData[]);
  }, [userinfo.menus, dataToJson]);

  // 构建表格字段
  const tableColumns = [
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
      render: (v: number) =>
        v === 1 ? (
          <span style={{ color: "green" }}>启用</span>
        ) : (
          <span style={{ color: "red" }}>禁用</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 120,
      render: (v: number, record: TableRecordData) => {
        const controls = [];
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

  // 构建表格数据
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
        control: item.id,
      };
    });
  }, [data]);

  // 新增或修改时 构建‘赋予’项数据
  const rolesCheckboxData = useMemo(() => {
    return roles.map((item) => ({
      label: item.title,
      value: item.id,
    }));
  }, [roles]);

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
        title={`${
          { add: "新增", up: "修改", see: "查看" }[modal.operateType]
        }权限: ${treeSelect.title}->${modal.nowData?.title ?? ""}`}
        visible={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
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
              disabled={modal.operateType === "see"}
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
              disabled={modal.operateType === "see"}
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
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
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
              disabled={modal.operateType === "see"}
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
          <Form.Item label="赋予" {...formItemLayout}>
            <Checkbox.Group
              disabled={modal.operateType === "see"}
              options={rolesCheckboxData}
              value={rolesCheckboxChose}
              onChange={(v: CheckboxValueType[]) =>
                setRolesCheckboxChose(v as number[])
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PowerAdminContainer;

/** 菜单管理页 **/

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
import { IconsData } from "@/util/json";
import { useModal } from "@/hooks"; // 自定义的hooks

// ==================
// 所需的组件
// ==================
import Icon from "@/components/Icon";

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
function MenuAdminContainer(props) {
  const p = props.powersCode;
  const [form] = Form.useForm();

  const [data, setData] = useState([]); // 所有的菜单数据（未分层级）
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  const {
    operateType,
    nowData,
    modalShow,
    modalLoading,
    setModal,
  } = useModal(); // 模态框相关参数控制

  const [treeSelect, setTreeSelect] = useState({});

  useEffect(() => {
    getData();
  }, []);

  /** 获取本页面所需数据 **/
  const getData = useCallback(async () => {
    const p = props.powersCode;
    if (!p.includes("menu:query")) {
      return;
    }
    setLoading(true);
    try {
      const res = await props.getMenus();
      if (res.status === 200) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, [props]);

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
  const onTreeSelect = useCallback((keys, e) => {
    let treeSelect = {};
    if (e.selected) {
      // 选中
      treeSelect = { title: e.node.title, id: e.node.id };
    }
    setTreeSelect(treeSelect);
  }, []);

  /** 工具 - 根据parentID返回parentName **/
  const getNameByParentId = useCallback(
    (id) => {
      const p = data.find((item) => item.id === id);
      return p ? p.title : undefined;
    },
    [data]
  );

  /** 新增&修改 模态框出现 **/
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
          // const v = form.getFieldsValue();
          form.setFieldsValue({
            formConditions: data.conditions,
            formDesc: data.desc,
            formIcon: data.icon,
            formSorts: data.sorts,
            formTitle: data.title,
            formUrl: data.url,
          });
        }
      });
    },
    [form, setModal]
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
        url: values.formUrl,
        icon: values.formIcon,
        parent: Number(treeSelect.id) || null,
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
          const res = await props.addMenu(params);
          if (res.status === 200) {
            message.success("添加成功");
            getData();
            onClose();
            props.updateUserInfo();
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
          const res = await props.upMenu(params);
          if (res.status === 200) {
            message.success("修改成功");
            getData();
            onClose();
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
    props,
    treeSelect.id,
    getData,
    onClose,
    setModal,
  ]);

  /** 删除一条数据 **/
  const onDel = useCallback(
    (record) => {
      const params = { id: record.id };
      props.delMenu(params).then((res) => {
        if (res.status === 200) {
          getData();
          props.updateUserInfo();
          message.success("删除成功");
        } else {
          message.error(res.message);
        }
      });
    },
    [props, getData]
  );

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const sourceData = useMemo(() => {
    const d = _.cloneDeep(data);
    d.forEach((item) => {
      item.key = String(item.id);
    });
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    return dataToJson(null, d) || [];
  }, [data, dataToJson]);

  /** 构建表格字段 **/
  const tableColumns = useMemo(() => {
    return [
      {
        title: "序号",
        dataIndex: "serial",
        key: "serial",
      },
      {
        title: "图标",
        dataIndex: "icon",
        key: "icon",
        render: (text) => {
          return text ? <Icon type={text} /> : "";
        },
      },
      {
        title: "菜单名称",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "路径",
        dataIndex: "url",
        key: "url",
        render: (text, record) => {
          return text ? `/${text.replace(/^\//, "")}` : "";
        },
      },
      {
        title: "描述",
        dataIndex: "desc",
        key: "desc",
      },
      {
        title: "父级",
        dataIndex: "parent",
        key: "parent",
        render: (text) => getNameByParentId(text),
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
          const p = props.powersCode;
          let controls = [];

          p.includes("menu:query") &&
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
          p.includes("menu:up") &&
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
          p.includes("menu:del") &&
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
  }, [props.powersCode, getNameByParentId, onDel, onModalShow]);

  /** 构建表格数据 **/
  const tableData = useMemo(() => {
    return data
      .filter((item) => item.parent === (Number(treeSelect.id) || null))
      .map((item, index) => {
        return {
          key: index,
          id: item.id,
          icon: item.icon,
          parent: item.parent,
          title: item.title,
          url: item.url,
          desc: item.desc,
          sorts: item.sorts,
          conditions: item.conditions,
          serial: index + 1,
        };
      });
  }, [data, treeSelect.id]);

  return (
    <div className="page-menu-admin">
      <div className="l">
        <div className="title">目录结构</div>
        <div>
          <Tree
            defaultExpandedKeys={["0"]}
            onSelect={onTreeSelect}
            selectedKeys={[String(treeSelect.id)]}
            treeData={sourceData}
          ></Tree>
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
                disabled={!p.includes("menu:add")}
              >
                {`添加${treeSelect.title || "根级"}子菜单`}
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
        title={`${{ add: "新增", up: "修改", see: "查看" }[operateType]}`}
        visible={modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modalLoading}
      >
        <Form form={form} initialValues={{ formConditions: 1 }}>
          <Form.Item
            label="菜单名"
            name="formTitle"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入菜单名"
              disabled={operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="菜单链接"
            name="formUrl"
            {...formItemLayout}
            rules={[{ required: true, whitespace: true, message: "必填" }]}
          >
            <Input
              placeholder="请输入菜单链接"
              disabled={operateType === "see"}
            />
          </Form.Item>
          <Form.Item label="图标" name="formIcon" {...formItemLayout}>
            <Select
              dropdownClassName="iconSelect"
              disabled={operateType === "see"}
            >
              {IconsData.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    <Icon type={item} />
                  </Option>
                );
              })}
            </Select>
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
          {operateType === "add" ? (
            <Form.Item label="赋予" {...formItemLayout}>
              <span style={{ color: "green" }}>
                新增菜单后请前往角色管理将菜单授权给相关角色
              </span>
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
}

export default connect(
  (state) => ({
    roles: state.sys.roles,
    powersCode: state.app.powersCode,
  }),
  (dispatch) => ({
    addMenu: dispatch.sys.addMenu,
    getMenus: dispatch.sys.getMenus,
    upMenu: dispatch.sys.upMenu,
    delMenu: dispatch.sys.delMenu,
    updateUserInfo: dispatch.app.updateUserInfo,
  })
)(MenuAdminContainer);

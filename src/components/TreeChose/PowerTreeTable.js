import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Modal, Table, Checkbox, Spin } from "antd";
import _ from "lodash";

/**
 * 本组件
 * 用于角色授权的树形表格
 * @param title 指定模态框标题
 * @param data 所有的菜单&权限原始数据
 * @param defaultChecked 需要默认选中的项
 * @param modalShow 是否显示
 * @param initloading 初始化时，树是否处于加载中状态
 * @param loading 提交表单时，树的确定按钮是否处于等待状态
 * @param onClose 关闭模态框
 * @param onOk 确定选择，将所选项信息返回上级
 */
export default function TreeTable(props) {
  const [treeChecked, setTreeChecked] = useState([]); // 受控，所有被选中的表格行
  const [btnDtoChecked, setBtnDtoChecked] = useState([]); // 受控，所有被选中的权限数据

  // ==================
  // 副作用
  // ==================

  // 哪些需要被默认选中
  useEffect(() => {
    setTreeChecked(props.defaultChecked.menus || []);
    setBtnDtoChecked(props.defaultChecked.powers || []);
  }, [props.defaultChecked]);

  // ==================
  // 私有方法
  // ==================

  // 提交
  const onOk = useCallback(() => {
    props.onOk &&
      props.onOk({
        menus: treeChecked,
        powers: btnDtoChecked,
      });
  }, [props, btnDtoChecked, treeChecked]);

  // 关闭模态框
  const onClose = useCallback(() => {
    props.onClose();
  }, [props]);

  // 被选中的权限 受控
  const dtoIsChecked = useCallback(
    (id) => {
      return !!btnDtoChecked.find((item) => item === id);
    },
    [btnDtoChecked]
  );

  // TABLE btn权限选中和取消选中，需要记录哪些被选中
  const onBtnDtoChange = useCallback(
    (e, id, record) => {
      const old = [...btnDtoChecked];
      let treeCheckedTemp = [...treeChecked];
      if (e.target.checked) {
        // 选中
        old.push(id);
        treeCheckedTemp = Array.from(new Set([record.id, ...treeChecked]));
      } else {
        // 取消选中
        old.splice(old.indexOf(id), 1);
        // 判断当前这一行的权限中是否还有被选中的，如果全都没有选中，那当前菜单也要取消选中
        const tempMap = record.powers.map((item) => item.id);
        if (
          !btnDtoChecked.some(
            (item) => item !== id && tempMap.indexOf(item) >= 0
          )
        ) {
          treeCheckedTemp.splice(treeCheckedTemp.indexOf(record.id), 1);
        }
      }

      setBtnDtoChecked(old);
      setTreeChecked(treeCheckedTemp);
    },
    [btnDtoChecked, treeChecked]
  );

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback((one, data) => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item) => !item.parent);
    } else {
      kids = data.filter((item) => item.parent === one.id);
    }
    kids.forEach((item) => {
      item.children = dataToJson(item, data);
      item.key = item.id;
    });
    return kids.length ? kids : null;
  }, []);

  // ==================
  // 计算属性 memo
  // ==================

  // 处理原始数据，将原始数据处理为层级关系(菜单的层级关系)
  const sourceData = useMemo(() => {
    let d = [...props.data];
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });

    return dataToJson(null, d) || [];
  }, [props.data, dataToJson]);

  // TABLE 列表项前面是否有多选框，并配置行为
  const tableRowSelection = useMemo(() => {
    return {
      onChange: (selectedRowKeys, selectedRows) => {
        setTreeChecked(selectedRowKeys);
      },
      onSelect: (record, selected, selectedRows) => {
        const t = props.data.find((item) => item.id === record.id);
        if (selected) {
          // 选中，连带其权限全部勾选
          if (t && Array.isArray(t.powers)) {
            const temp = Array.from(
              new Set([...t.powers.map((item) => item.id), ...btnDtoChecked])
            );
            setBtnDtoChecked(temp);
          }
        } else {
          // 取消选中，连带其权限全部取消勾选
          if (t && Array.isArray(t.powers)) {
            const mapTemp = t.powers.map((item) => item.id);
            const temp = btnDtoChecked.filter(
              (item) => mapTemp.indexOf(item) < 0
            );
            setBtnDtoChecked(temp);
          }
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected) {
          // 选中
          setBtnDtoChecked(
            props.data.reduce((v1, v2) => {
              return [...v1, ...v2.powers.map((k) => k.id)];
            }, [])
          );
        } else {
          setBtnDtoChecked([]);
        }
      },
      selectedRowKeys: treeChecked,
    };
  }, [props.data, treeChecked, btnDtoChecked]);

  // TABLE 字段
  const tableColumns = useMemo(() => {
    return [
      {
        title: "菜单",
        dataIndex: "title",
        key: "title",
        width: "30%",
      },
      {
        title: "权限",
        dataIndex: "powers",
        key: "powers",
        width: "70%",
        render: (value, record) => {
          if (value) {
            return value.map((item, index) => {
              return (
                <Checkbox
                  key={index}
                  checked={() => dtoIsChecked(item.id)}
                  onChange={(e) => onBtnDtoChange(e, item.id, record)}
                >
                  {item.title}
                </Checkbox>
              );
            });
          }
        },
      },
    ];
  }, [dtoIsChecked, onBtnDtoChange]);

  return (
    <Modal
      className="menu-tree-table"
      zIndex={1001}
      width={750}
      title={props.title || "请选择"}
      visible={props.modalShow}
      onOk={onOk}
      onCancel={onClose}
      confirmLoading={props.loading}
    >
      {props.initloading ? (
        <div style={{ textAlign: "center" }}>
          <Spin tip="加载中…" />
        </div>
      ) : (
        <Table
          columns={tableColumns}
          rowSelection={tableRowSelection}
          dataSource={sourceData}
          pagination={false}
          defaultExpandAllRows
        />
      )}
    </Modal>
  );
}

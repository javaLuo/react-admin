/** 权限Table树 **/

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Modal, Table, Checkbox, Spin } from "antd";
import { Power, PowerTree } from "@/models/index.type";

// ==================
// 类型声明
// ==================

// 默认被选中的菜单和权限
export type PowerTreeDefault = {
  menus: number[];
  powers: number[];
};

export type PowerLevel = Power & {
  parent?: Power;
  children?: Power;
  key?: number;
};

interface Props {
  title: string; // 指定模态框标题
  data: PowerTree[]; // 所有的菜单&权限原始数据
  defaultChecked: PowerTreeDefault; // 需要默认选中的项
  modalShow: boolean; // 是否显示
  initloading?: boolean; // 初始化时，树是否处于加载中状态
  loading: boolean; // 提交表单时，树的确定按钮是否处于等待状态
  onClose: Function; // 关闭模态框
  onOk: Function; // 确定选择，将所选项信息返回上级
}

// ==================
// 本组件 用于角色授权的树形表格
// ==================
export default function TreeTable(props: Props): JSX.Element {
  const [treeChecked, setTreeChecked] = useState<number[]>([]); // 受控，所有被选中的表格行
  const [btnDtoChecked, setBtnDtoChecked] = useState<number[]>([]); // 受控，所有被选中的权限数据

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
    (id: number): boolean => {
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
        const tempMap = record.powers.map((item: Power) => item.id);
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
      kids = data.filter((item: PowerLevel) => !item.parent);
    } else {
      kids = data.filter((item: PowerLevel) => item.parent === one.id);
    }
    kids.forEach((item: PowerLevel) => {
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
    const d = [...props.data];
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });

    return dataToJson(null, d) || [];
  }, [props.data, dataToJson]);

  // TABLE 列表项前面是否有多选框，并配置行为
  type TableData = {
    id: number;
  };

  const tableRowSelection = useMemo(() => {
    return {
      onChange: (selectedRowKeys: number[]): void => {
        setTreeChecked(selectedRowKeys);
      },
      onSelect: (record: TableData, selected: boolean): void => {
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
      onSelectAll: (selected: boolean) => {
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
        render: (value: Power[], record: PowerLevel): JSX.Element[] | null => {
          if (value) {
            return value.map((item: Power, index: number) => {
              return (
                <Checkbox
                  key={index}
                  checked={dtoIsChecked(item.id)}
                  onChange={(e): void => onBtnDtoChange(e, item.id, record)}
                >
                  {item.title}
                </Checkbox>
              );
            });
          }
          return null;
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

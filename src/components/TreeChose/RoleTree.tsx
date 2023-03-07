/* Tree选择 - 角色选择 - 多选 */
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Tree, Modal } from "antd";
import { cloneDeep } from "lodash";
import { Role } from "@/models/index.type";

// ==================
// 类型声明
// ==================

type RoleLevel = Role & {
  key: string | number;
  parent?: RoleLevel;
  children?: RoleLevel[];
};

interface Props {
  title: string; // 标题
  data: Role[]; //  原始数据
  defaultKeys: number[]; // 当前默认选中的key们
  visible: boolean; // 是否显示
  loading: boolean; // 确定按钮是否在等待中状态
  onOk: (keys: string[], role: Role[]) => Promise<void>; // 确定
  onClose: () => void; // 关闭
}

// ==================
// 本组件
// ==================
export default function RoleTreeComponent(props: Props): JSX.Element {
  const [nowKeys, setNowKeys] = useState<string[]>([]);

  useEffect(() => {
    setNowKeys(props.defaultKeys.map((item) => `${item}`));
  }, [props.defaultKeys]);

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback(
    (one: RoleLevel | undefined, data: RoleLevel[]) => {
      let kids;
      if (!one) {
        // 第1次递归
        kids = data.filter((item: RoleLevel) => !item.parent);
      } else {
        kids = data.filter((item: RoleLevel) => item.parent?.id === one.id);
      }
      kids.forEach(
        (item: RoleLevel) => (item.children = dataToJson(item, data))
      );
      return kids.length ? kids : undefined;
    },
    []
  );

  // 点击确定时触发
  const onOk = useCallback(() => {
    // 通过key返回指定的数据
    const res = props.data.filter((item) => {
      return nowKeys.includes(`${item.id}`);
    });
    // 返回选中的keys和选中的具体数据
    props.onOk && props.onOk(nowKeys, res);
  }, [props, nowKeys]);

  // 点击关闭时触发
  const onClose = useCallback(() => {
    props.onClose();
  }, [props]);

  // 选中或取消选中时触发
  const onCheck = useCallback((keys: any) => {
    setNowKeys(keys);
  }, []);

  // ==================
  // 计算属性 memo
  // ==================

  // 工具 - 赋值Key
  const makeKey = useCallback((data: Role[]) => {
    const newData: RoleLevel[] = [];
    for (let i = 0; i < data.length; i++) {
      const item: any = { ...data[i] };
      if (item.children) {
        item.children = makeKey(item.children);
      }
      const treeItem: RoleLevel = {
        ...(item as RoleLevel),
        key: item.id,
      };
      newData.push(treeItem);
    }
    return newData;
  }, []);

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData = useMemo(() => {
    const roleData: Role[] = cloneDeep(props.data);

    // 这应该递归，把children数据也赋值key
    const d: RoleLevel[] = makeKey(roleData);

    d.forEach((item) => {
      item.key = String(item.id);
    });
    return dataToJson(undefined, d) || [];
  }, [props.data, dataToJson]);

  return (
    <Modal
      title={props.title || "请选择"}
      visible={props.visible}
      wrapClassName="menuTreeModal"
      confirmLoading={props.loading}
      onOk={onOk}
      onCancel={onClose}
    >
      <Tree
        checkable
        selectable={false}
        checkedKeys={nowKeys}
        onCheck={onCheck}
        treeData={sourceData}
      />
    </Modal>
  );
}

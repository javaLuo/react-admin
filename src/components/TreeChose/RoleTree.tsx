/* Tree选择 - 角色选择 - 多选 */
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Tree, Modal } from "antd";
import { cloneDeep } from "lodash";
import { Role } from "@/models/index.type";

// ==================
// 类型声明
// ==================

type RoleLevel = Role & {
  key?: string;
  parent?: Role;
  children?: Role;
};

interface Props {
  title: string; // 标题
  data: Role[]; //  原始数据
  defaultKeys: number[]; // 当前默认选中的key们
  visible: boolean; // 是否显示
  loading: boolean; // 确定按钮是否在等待中状态
  onOk: Function; // 确定
  onClose: Function; // 关闭
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
  const dataToJson = useCallback((one, data) => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item: RoleLevel) => !item.parent);
    } else {
      kids = data.filter((item: RoleLevel) => item.parent === one.id);
    }
    kids.forEach((item: RoleLevel) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : null;
  }, []);

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
  const onCheck = useCallback((keys) => {
    setNowKeys(keys);
  }, []);

  // ==================
  // 计算属性 memo
  // ==================

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData = useMemo(() => {
    const d: RoleLevel[] = cloneDeep(props.data);
    d.forEach((item) => {
      item.key = String(item.id);
    });
    return dataToJson(null, d) || [];
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

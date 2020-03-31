/* Tree选择 - 角色选择 - 多选 */
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Tree, Modal } from "antd";
import _ from "lodash";

/**
 * 本组件
 * @param data 原始数据
 * @param title 标题
 * @param visible 是否显示
 * @param defaultKeys 当前默认选中的key们
 * @param loading 确定按钮是否在等待中状态
 * @param onOk 确定
 * @param onClose 关闭
 */
export default function RoleTreeComponent(props) {
  const [nowKeys, setNowKeys] = useState([]);

  useEffect(() => {
    setNowKeys(props.defaultKeys.map((item) => `${item}`));
  }, [props.defaultKeys]);

  // 工具 - 递归将扁平数据转换为层级数据
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
    const d = _.cloneDeep(props.data);
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
      onCancel={onClose}>
      <Tree checkable selectable={false} checkedKeys={nowKeys} onCheck={onCheck} treeData={sourceData}></Tree>
    </Modal>
  );
}

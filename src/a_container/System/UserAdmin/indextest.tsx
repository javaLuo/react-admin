import React, { useState, useEffect } from "react";
import { Table, Input, message } from "antd";
import { columns } from "./article-config";
import PageLayout from "../../common/components/page-layout";
import { fetchHero, delHero, editeHero } from "../../utils/api";
import { Operate } from "./oprations";
import "./index.scss";

const editPrams: any = {};

function EditCell(props: any) {
  const { editing, children, col, rowIndex, record } = props;
  let res: any = null;
  if (col && col.editable && col.editable) {
    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
      editPrams[col.key] = e.currentTarget.value;
      editPrams.index = rowIndex;
    };
    res = editing ? <Input defaultValue={record[col.key]} onChange={change} /> : <div>{record[col.key]}</div>;
  } else {
    res = col && col.dataIndex === "operation" ? <Operate {...props} editing={editing} /> : children;
  }
  return <td>{res}</td>;
}

const Comments = () => {
  const [tableData, setTableData] = useState([]);
  const [editingKey, setEditingKey] = useState();
  const [refresh, setRefresh] = useState(1);
  useEffect(() => {
    (async () => {
      const { data } = await fetchHero();
      setTableData(data.result.list || []);
      cancel();
    })();
  }, [refresh]);
  // 保存
  async function save(record: any) {
    if (editPrams.index === null) return;
    const { data } = await editeHero(record._id, { state: editPrams.state });
    setRefresh(refresh + 1);
    message.success(data.message);
  }
  // 编辑
  function edit(index: number) {
    editPrams.index = null;
    setEditingKey(index);
  }
  // 取消
  function cancel() {
    setEditingKey("");
  }
  // 删除
  async function del(record: any) {
    const { data } = await delHero(record._id);
    setRefresh(refresh + 1);
    message.success(data.message);
  }
  // 是否编辑行
  function isEditing(index: number) {
    return index === editingKey;
  }
  // 自定义列内容
  const tableColumns = columns.map(col => {
    if (col.editable) {
      return {
        ...col,
        onCell: (record: any, rowIndex: number) => ({ record, col, rowIndex, editing: isEditing(rowIndex) }),
      };
    } else if (col.dataIndex === "operation") {
      return {
        ...col,
        onCell: (record: any, rowIndex: number) => ({ col, record, save, edit, cancel, del, rowIndex, editing: isEditing(rowIndex) }),
      };
    } else {
      return col;
    }
  });
  const components = { body: { cell: EditCell } };
  return (
    <>
      <PageLayout title="评论管理">
        <Table components={components} className="messages" columns={tableColumns} dataSource={tableData} bordered size="middle" rowKey="_id" />
      </PageLayout>
    </>
  );
};

export default Comments;

/** 当前页面所需所有类型声明 **/

import { Menu } from "@/models/index.type";
export type { Menu, MenuParam } from "@/models/index.type";
import { History } from "history";
import { match } from "react-router-dom";

// 构建table所需数据
export interface TableRecordData extends Menu {
  key: number;
  serial: number;
  control: number;
}
export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: TableRecordData | null;
  modalShow: boolean;
  modalLoading: boolean;
};

export type Props = {
  history: History;
  location: Location;
  match: match;
};

export interface TreeSourceData {
  id: number; // ID,添加时可以没有id
  key: string | number;
  title: string; // 标题
  icon: string; // 图标
  url: string; // 链接路径
  parent: number | null; // 父级ID
  desc: string; // 描述
  sorts: number; // 排序编号
  conditions: number; // 状态，1启用，-1禁用
  children?: TreeSourceData[]; // 子菜单
}

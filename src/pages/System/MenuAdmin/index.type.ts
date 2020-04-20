/** 当前页面所需所有类型声明 **/

import { Menu } from "@/models/index.type";
export type { Menu, MenuParam } from "@/models/index.type";

// 分页相关参数控制
export interface Page {
  pageNum: number; // 当前页码
  pageSize: number; // 每页显示多少条
  total: number; // 总共多少条数据
}

// 构建table所需数据
export interface TableRecordData extends Menu {
  key: number;
  serial: number;
  control: number;
}
export type operateType = "add" | "see" | "up";

export interface ModalType {
  operateType: operateType;
  nowData: TableRecordData | null;
  modalShow: boolean;
  modalLoading: boolean;
}

/** 当前页面所需所有类型声明 **/

import { IMenu } from "@/models/index.type";
export type { IMenu, IMenuParam } from "@/models/index.type";

// 分页相关参数控制
export type Page = {
  pageNum: number; // 当前页码
  pageSize: number; // 每页显示多少条
  total: number; // 总共多少条数据
};

// 构建table所需数据
export type TableRecordData = IMenu & {
  key: number;
  serial: number;
  control: number;
};
export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: TableRecordData | null;
  modalShow: boolean;
  modalLoading: boolean;
};

export type IMenuLevel = IMenu & {
  parent?: IMenu;
  children?: IMenu;
  key?: string;
};

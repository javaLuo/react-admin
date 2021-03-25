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

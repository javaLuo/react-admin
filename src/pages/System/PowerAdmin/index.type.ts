/** 当前页面所需所有类型声明 **/

import { PowerTreeDefault } from "@/components/TreeChose/PowerTreeTable";
import { Power, Menu } from "@/models/index.type";

export type {
  Menu,
  UserInfo,
  Role,
  Power,
  PowerParam,
  Res,
} from "@/models/index.type";

// 构建table所需数据
export type TableRecordData = Power & {
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
export type PowerTreeInfo = {
  treeOnOkLoading: boolean; // 是否正在分配权限
  powerTreeShow: boolean; // 权限树是否显示
  // 树默认需要选中的项
  powerTreeDefault: PowerTreeDefault;
};
export type SearchInfo = {
  title: string | undefined; // 用户名
  conditions: number | undefined; // 状态
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

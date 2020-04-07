import { PowerTreeDefault } from "@/components/TreeChose/PowerTreeTable";
import { IPower, IMenu } from "@/models/index.type";

// 分页相关参数控制
export type Page = {
  pageNum: number; // 当前页码
  pageSize: number; // 每页显示多少条
  total: number; // 总共多少条数据
};

// 构建table所需数据
export type TableRecordData = IPower & {
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

export type IPowerLevel = IPower & {
  parent?: IPower;
  children?: IPower;
  key?: string;
};

export type IMenuLevel = IMenu & {
  parent?: IMenu;
  children?: IMenu;
  key?: string;
};

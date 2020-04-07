import { PowerTreeDefault } from "@/components/TreeChose/PowerTreeTable";
import { IRole } from "@/models/index.type";

// 分页相关参数控制
export type Page = {
  pageNum: number; // 当前页码
  pageSize: number; // 每页显示多少条
  total: number; // 总共多少条数据
};

// 构建table所需数据
export type TableRecordData = IRole & {
  key: number;
  serial: number;
  control: number;
};

// 模态框打开的类型 see查看，add添加，up修改
export type operateType = "see" | "add" | "up";

// 模态框相关参数
export type ModalType = {
  operateType: operateType;
  nowData: TableRecordData | null;
  modalShow: boolean;
  modalLoading: boolean;
};

// 权限树相关参数
export type PowerTreeInfo = {
  treeOnOkLoading: boolean; // 是否正在分配权限
  powerTreeShow: boolean; // 权限树是否显示
  powerTreeDefault: PowerTreeDefault; // 树默认需要选中的项
};

// 搜索相关参数
export type SearchInfo = {
  title: string | undefined; // 用户名
  conditions: number | undefined; // 状态
};

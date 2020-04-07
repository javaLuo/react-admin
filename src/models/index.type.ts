// 菜单对象
export type IMenu = {
  id: number;
  title: string;
  icon: string;
  url: string;
  parent: number;
  desc: string;
  sorts: number;
  conditions: number;
  children?: IMenu[];
};

export interface IMenuParam {
  title: string;
  icon: string;
  url: string;
  parent: number;
  desc: string;
  sorts: number;
  conditions: number;
}

// 角色对象
export interface IRole {
  id: number;
  title: string;
  desc: string;
  sorts: number;
  conditions: number;
  menuAndPowers: IMenuAndPower[];
}

export type IRoleParam = {
  id?: number;
  title: string;
  desc: string;
  sorts: number;
  conditions: number;
  menuAndPowers?: IMenuAndPower[];
};

export interface IPower {
  id: number; // ID
  menu: number; // 所属的菜单
  title: string; // 标题
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  conditions: number; // 状态 1启用，-1禁用
}
export interface IPowerParam {
  id?: number;
  menu: number; // 所属的菜单
  title: string; // 标题
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  conditions: number; // 状态 1启用，-1禁用
}

export interface IMenuAndPower {
  menuId: number;
  powers: number[];
}

// UserInfo 用户数据类型
export interface IUserInfo {
  userBasicInfo: IUserBasicInfo | null;
  menus: IMenu[];
  roles: IRole[];
  powers: IPower[];
}

export interface IUserBasicInfo {
  id: number; // ID
  username: string; // 用户名
  password: string | number; // 密码
  phone: string | number; // 手机
  email: string; // 邮箱
  desc: string; // 描述
  conditions: number; // 状态 1启用，-1禁用
  roles: number[]; // 拥有的所有角色ID
}

export type IUserBasicInfoParam = {
  id?: number; // ID
  username: string; // 用户名
  password: string | number; // 密码
  phone: string | number; // 手机
  email: string; // 邮箱
  desc: string; // 描述
  conditions: number; // 状态 1启用，-1禁用
};

export type PowerTree = IMenu & {
  powers: IPower[];
};

export type appState = {
  userinfo: IUserInfo;
  powersCode: string[];
};

export type sysState = {
  menus: IMenu[];
  roles: IRole[];
  powerTreeData: PowerTree[];
};

/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import qs from "qs";
import { message } from "antd";
import { Dispatch } from "@/store";
import { IUserBasicInfo } from "./app";

// 菜单对象
export interface IMenu {
  id: number;
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

export interface IMenuAndPower {
  menuId: number;
  powers: number[];
}

export interface IPower {
  id: number; // ID
  menu: number; // 所属的菜单
  title: string; // 标题
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  conditions: number; // 状态 1启用，-1禁用
}

interface IMenuParam {
  title: string;
  icon: string;
  url: string;
  parent: number;
  desc: string;
  sorts: number;
  conditions: number;
}
interface IPowerParam {
  menu: number; // 所属的菜单
  title: string; // 标题
  code: string; // CODE
  desc: string; // 描述
  sorts: number; // 排序
  conditions: number; // 状态 1启用，-1禁用
}
interface IRoleParam {
  title: string;
  desc: string;
  sorts: number;
  conditions: number;
  menuAndPowers: IMenuAndPower[];
}
export type sysState = {
  menus: IMenu[];
  roles: IRole[];
  powerTreeData: IPower[];
};

const defaultState: sysState = {
  menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
  roles: [], // 所有的角色信息（用于Model赋予项，无视权限）
  powerTreeData: [], // 分配权限treeTable组件所需原始数据
};

export default {
  state: defaultState,
  reducers: {
    // 保存所有菜单数据
    reducerSetMenus(state: sysState, payload: IMenu[]) {
      return { ...state, menus: payload };
    },
    // 保存所有角色数据
    reducerSetRoles(state: sysState, payload: IRole[]) {
      return { ...state, roles: payload };
    },

    // 保存所有权限数据
    reducerSetAllPowers(state: sysState, payload: IPower[]) {
      return { ...state, powerTreeData: payload };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 获取所有菜单
     * **/
    async getMenus() {
      try {
        const res = await axios.get("/api/getmenus");
        if (res.status === 200) {
          dispatch.sys.reducerSetMenus(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 根据菜单ID获取对应的菜单信息
     * @param id 可以是一个数字也可以是一个数组
     * **/
    async getMenusById(params: number[] | number = []) {
      try {
        const res = await axios.post(`/api/getMenusById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 添加菜单
     * @param params IMenuParam
     */
    async addMenu(params: IMenuParam) {
      try {
        const res = await axios.post("/api/addmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 修改菜单
     * **/
    async upMenu(params: IMenu) {
      try {
        const res = await axios.post("/api/upmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 删除菜单
     * **/
    async delMenu(params: { id: Number }) {
      try {
        const res = await axios.post("/api/delmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 根据菜单ID查询其下的权限数据
     * **/
    async getPowerDataByMenuId(params: { menuId: number }) {
      try {
        const res = await axios.get(
          `/api/getpowerbymenuid?${qs.stringify(params)}`
        );
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 根据权限ID查询对应的权限数据
     * @param id 可以是一个数字也可以是一个数组
     * **/
    async getPowerById(params: { id: number | number[] }) {
      try {
        const res = await axios.post(`/api/getPowerById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /** 获取所有角色 **/
    async getAllRoles() {
      try {
        const res = await axios.get("/api/getAllRoles");
        if (res.status === 200) {
          dispatch.sys.reducerSetRoles(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 添加权限
     * **/
    async addPower(params: IPowerParam) {
      try {
        const res = await axios.post("/api/addpower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 修改权限
     * **/
    async upPower(params: IPower) {
      try {
        const res = await axios.post("/api/uppower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 删除权限
     * **/
    async delPower(params: { id: number }) {
      try {
        const res = await axios.post("/api/delpower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 分页查询角色数据
     * **/
    async getRoles(params: {
      pageNum: number;
      pageSize: number;
      title?: string;
      conditions?: number;
    }) {
      try {
        const res = await axios.get(`/api/getroles?${qs.stringify(params)}`);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 通过角色ID查询对应的角色数据
     * @param id 可以是一个数字，也可以是一个数组
     * @return 返回值是数组
     * **/
    async getRoleById(params: { id: number | number[] }) {
      try {
        const res = await axios.post(`/api/getRoleById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 添加角色
     * **/
    async addRole(params: IRoleParam) {
      try {
        const res = await axios.post("/api/addrole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 修改角色
     * **/
    async upRole(params: IRole) {
      try {
        const res = await axios.post("/api/uprole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 删除角色
     * **/
    async delRole(params: { id: number }) {
      try {
        const res = await axios.post("/api/delrole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 通过角色ID查询该角色拥有的所有菜单和权限详细信息
     * **/
    async findAllPowerByRoleId(params: { id: number }) {
      try {
        const res = await axios.get(
          `/api/findAllPowerByRoleId?${qs.stringify(params)}`
        );
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 获取所有的菜单及权限详细信息
     * **/
    async getAllPowers() {
      try {
        const res = await axios.get(`/api/getAllPowers`);
        if (res.status === 200) {
          dispatch.sys.reducerSetAllPowers(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 通过角色ID给指定角色设置菜单及权限
     * **/
    async setPowersByRoleId(params: { id: number }) {
      try {
        const res = await axios.post("/api/setPowersByRoleId", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * (批量)通过角色ID给指定角色设置菜单及权限
     * @param params [{id,menus,powers},...]
     * */
    async setPowersByRoleIds(
      params: { id: number; menus: number[]; powers: number[] }[]
    ) {
      try {
        console.log("idsaaaa:", params);
        const res = await axios.post("/api/setPowersByRoleIds", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 条件分页查询用户列表
     * **/
    async getUserList(params: {
      pageNum: number;
      pageSize: number;
      username?: string;
      conditions?: number;
    }) {
      try {
        const res = await axios.get(`/api/getUserList?${qs.stringify(params)}`);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 添加用户
     * **/
    async addUser(params: {
      username: string;
      password: string | number;
      phone: string | number;
      email: string;
      desc: string;
      conditions: number;
    }) {
      try {
        const res = await axios.post("/api/addUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 修改用户
     * **/
    async upUser(params: IUserBasicInfo) {
      try {
        const res = await axios.post("/api/upUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 删除用户
     * **/
    async delUser(params: { id: number }) {
      try {
        const res = await axios.post("/api/delUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },

    /**
     * 给用户分配角色
     * **/
    async setUserRoles(params = {}) {
      try {
        const res = await axios.post("/api/setUserRoles", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
  }),
};

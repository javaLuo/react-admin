/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";
import { Dispatch, iRootState } from "@/store";
import { IPower } from "@/models/sys";
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
  children?: IMenu[];
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

// UserInfo 用户数据类型
export interface IUserInfo {
  userBasicInfo: IUserBasicInfo | null;
  menus: IMenu[];
  roles: IRole[];
  powers: any[];
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

export type appState = {
  userinfo: IUserInfo;
  powersCode: string[];
};

export default {
  state: {
    userinfo: {
      roles: [], // 当前用户拥有的角色
      menus: [], // 当前用户拥有的已授权的菜单
      powers: [], // 当前用户拥有的权限数据
      userBasicInfo: null,
    }, // 当前用户基本信息
    powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
  } as appState,
  reducers: {
    reducerUserInfo(state: appState, payload: IUserInfo) {
      return {
        ...state,
        userinfo: payload,
        powersCode: payload.powers.map((item) => item.code),
      };
    },
    reducerLogout(state: appState) {
      return {
        ...state,
        userinfo: {
          menus: [],
          roles: [],
          powers: [],
        },
      };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 登录
     * @param { username, password } params
     * */
    async onLogin(params = {}) {
      try {
        const res = await axios.post("/api/login", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 退出登录
     * @param null
     * **/
    async onLogout() {
      try {
        // 同 dispatch({ type: "app/reducerLogout", payload: null });
        dispatch.app.reducerLogout();
        sessionStorage.removeItem("userinfo");
        return "success";
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 设置用户信息
     * @param: {*} params
     * **/
    async setUserInfo(params: IUserInfo) {
      dispatch.app.reducerUserInfo(params);
      return "success";
    },

    /** 修改了角色/菜单/权限信息后需要更新用户的roles,menus,powers数据 **/
    async updateUserInfo(params: null, rootState: iRootState) {
      /** 2.重新查询角色信息 **/
      const userinfo: IUserInfo = rootState.app.userinfo;

      const res2 = await dispatch.sys.getRoleById({
        id: userinfo.roles.map((item) => item.id),
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }

      const roles: IRole[] = res2.data.filter(
        (item: IRole) => item.conditions === 1
      );

      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        [] as IMenuAndPower[]
      );
      const res3 = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }
      const menus: IMenu[] = res3.data.filter(
        (item: IMenu) => item.conditions === 1
      );

      /** 4.根据权限id，获取权限信息 **/
      const res4 = await dispatch.sys.getPowerById({
        id: Array.from(
          new Set(
            menuAndPowers.reduce((a, b) => [...a, ...b.powers], [] as number[])
          )
        ),
      });
      if (!res4 || res4.status !== 200) {
        // 权限查询失败
        return res4;
      }
      const powers: IPower[] = res4.data.filter(
        (item: IPower) => item.conditions === 1
      );
      this.setUserInfo({
        ...userinfo,
        roles,
        menus,
        powers,
      });
      return;
    },
  }),
};

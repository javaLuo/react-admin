/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";
import { Dispatch, RootState } from "@/store";
import {
  Menu,
  Role,
  Power,
  MenuAndPower,
  UserInfo,
  AppState,
  Res,
} from "./index.type";

const defaultState: AppState = {
  userinfo: {
    roles: [], // 当前用户拥有的角色
    menus: [], // 当前用户拥有的已授权的菜单
    powers: [], // 当前用户拥有的权限数据
    userBasicInfo: null, // 用户的基础信息，id,用户名...
  }, // 当前用户基本信息
  powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
};
export default {
  state: defaultState,
  reducers: {
    reducerUserInfo(state: AppState, payload: UserInfo) {
      return {
        ...state,
        userinfo: payload,
        powersCode: payload.powers.map((item) => item.code),
      };
    },
    reducerLogout(state: AppState) {
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
        const res: Res = await axios.post("/api/login", params);
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
    async setUserInfo(params: UserInfo) {
      dispatch.app.reducerUserInfo(params);
      return "success";
    },

    /** 修改了角色/菜单/权限信息后需要更新用户的roles,menus,powers数据 **/
    async updateUserInfo(params: null, rootState: RootState) {
      /** 2.重新查询角色信息 **/
      const userinfo: UserInfo = rootState.app.userinfo;

      const res2: Res | undefined = await dispatch.sys.getRoleById({
        id: userinfo.roles.map((item) => item.id),
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }

      const roles: Role[] = res2.data.filter(
        (item: Role) => item.conditions === 1
      );

      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        [] as MenuAndPower[]
      );
      const res3: Res | undefined = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }
      const menus: Menu[] = res3.data.filter(
        (item: Menu) => item.conditions === 1
      );

      /** 4.根据权限id，获取权限信息 **/
      const res4: Res | undefined = await dispatch.sys.getPowerById({
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
      const powers: Power[] = res4.data.filter(
        (item: Power) => item.conditions === 1
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

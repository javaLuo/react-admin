/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";

export default {
  state: {
    userinfo: {
      roles: [], // 当前用户拥有的角色
      menus: [], // 当前用户拥有的已授权的菜单
      powers: [] // 当前用户拥有的权限数据
    }, // 当前用户基本信息
    powersCode: [] // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
  },
  reducers: {
    reducerUserInfo(state, payload) {
      return {
        ...state,
        userinfo: payload,
        powersCode: payload.powers.map(item => item.code)
      };
    },
    reducerLogout(state, payload) {
      return {
        ...state,
        userinfo: {
          menus: [],
          roles: [],
          powers: []
        }
      };
    }
  },

  effects: dispatch => ({
    /**
     * 登录
     * @param { username, password } params
     * */
    async onLogin(params = {}) {
      console.log("lo22222:", params);
      try {
        const res = await axios.post("api/login", params);
        console.log("lo3:", res);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 退出登录
     * @param null
     * **/
    async onLogout() {
      try {
        // 同 dispatch({ type: "app/reducerLogout", payload: null });
        this.reducerLogout();
        sessionStorage.removeItem("userinfo");
        return "success";
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 设置用户信息
     * @param: {*} params
     * **/
    async setUserInfo(params = {}) {
      console.log("设置用户信息", params);
      this.reducerUserInfo(params);
      return "success";
    },

    /** 修改了角色/菜单/权限信息后需要更新用户的roles,menus,powers数据 **/
    async updateUserInfo(params, rootState) {
      /** 2.重新查询角色信息 **/
      const userinfo = rootState.app.userinfo;

      const res2 = await dispatch.sys.getRoleById({
        id: userinfo.roles.map(item => item.id)
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }

      const roles = res2.data.filter(item => item.conditions === 1);

      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        []
      );
      const res3 = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map(item => item.menuId)))
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }
      const menus = res3.data.filter(item => item.conditions === 1);

      /** 4.根据权限id，获取权限信息 **/
      const res4 = await dispatch.sys.getPowerById({
        id: Array.from(
          new Set(menuAndPowers.reduce((a, b) => [...a, ...b.powers], []))
        )
      });
      if (!res4 || res4.status !== 200) {
        // 权限查询失败
        return res4;
      }
      const powers = res4.data.filter(item => item.conditions === 1);
      this.setUserInfo({
        ...userinfo,
        roles,
        menus,
        powers
      });
    }
  })
};

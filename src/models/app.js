/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";

export default {
  state: {
    userinfo: null, // 当前用户基本信息
    menus: [], // 当前用户所有已授权的菜单
    roles: [], // 当前用户拥有的所有角色
    powers: [] // 当前用户拥有的权限code列表，页面中的按钮的权限控制将根据此数据源判断
  },
  reducers: {
    reducerUserInfo(state, payload) {
      return {
        ...state,
        userinfo: payload.userInfo,
        menus: payload.menus,
        roles: payload.roles,
        powers: payload.powers.map(item => item.code)
      };
    },
    reducerLogout(state, payload) {
      return {
        ...state,
        userinfo: null,
        menus: [],
        roles: [],
        powers: []
      };
    }
  },

  effects: dispatch => ({
    /**
     * 登录
     * @param { username, password } params
     * */
    async onLogin(params = {}) {
      console.log("lo2:", params);
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
      this.reducerUserInfo(params);
      return "success";
    }
  })
};

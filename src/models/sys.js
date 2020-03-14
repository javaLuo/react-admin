/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import qs from "qs";
import { message } from "antd";

export default {
  state: {
    menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
    roles: [], // 所有的角色信息（用于Model赋予项，无视权限）
    powerTreeData: [] // 分配权限treeTable组件所需原始数据
  },
  reducers: {
    // 保存所有菜单数据
    reducerSetMenus(state, payload) {
      return { ...state, menus: payload };
    },
    // 保存所有角色数据
    reducerSetRoles(state, payload) {
      return { ...state, roles: payload };
    },

    // 保存所有权限数据
    reducerSetAllPowers(state, payload) {
      return { ...state, powerTreeData: payload };
    }
  },

  effects: dispatch => ({
    /**
     * 获取所有菜单
     * **/
    async getMenus() {
      try {
        const res = await axios.get("api/getmenus");
        if (res.status === 200) {
          this.reducerSetMenus(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 根据菜单ID获取对应的菜单信息
     * @param id 可以是一个数字也可以是一个数组
     * **/
    async getMenusById(params = []) {
      try {
        const res = await axios.post(`api/getMenusById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 添加菜单
     * @param { name, url, parent, icon, desc, sorts, conditions } params
     * **/
    async addMenu(params = {}) {
      try {
        const res = await axios.post("api/addmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 修改菜单
     * **/
    async upMenu(params = {}) {
      try {
        const res = await axios.post("api/upmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 删除菜单
     * **/
    async delMenu(params = {}) {
      try {
        const res = await axios.post("api/delmenu", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 根据菜单ID查询其下的权限数据
     * **/
    async getPowerDataByMenuId(params = {}) {
      try {
        const res = await axios.get(
          `api/getpowerbymenuid?${qs.stringify(params)}`
        );
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 根据权限ID查询对应的权限数据
     * @param id 可以是一个数字也可以是一个数组
     * **/
    async getPowerById(params = {}) {
      try {
        const res = await axios.post(`api/getPowerById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /** 获取所有角色 **/
    async getAllRoles() {
      try {
        const res = await axios.get("api/getAllRoles");
        if (res.status === 200) {
          this.reducerSetRoles(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 添加权限
     * **/
    async addPower(params = {}) {
      try {
        const res = await axios.post("api/addpower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 修改权限
     * **/
    async upPower(params = {}) {
      try {
        const res = await axios.post("api/uppower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 删除权限
     * **/
    async delPower(params = {}) {
      try {
        const res = await axios.post("api/delpower", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 分页查询角色数据
     * **/
    async getRoles(params = {}) {
      try {
        const res = await axios.get(`api/getroles?${qs.stringify(params)}`);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 通过角色ID查询对应的角色数据
     * @param id 可以是一个数字，也可以是一个数组
     * @return 返回值是数组
     * **/
    async getRoleById(params = {}) {
      try {
        const res = await axios.post(`api/getRoleById`, params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 添加角色
     * **/
    async addRole(params = {}) {
      try {
        const res = await axios.post("api/addrole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },
    /**
     * 修改角色
     * **/
    async upRole(params = {}) {
      try {
        const res = await axios.post("api/uprole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 删除角色
     * **/
    async delRole(params = {}) {
      try {
        const res = await axios.post("api/delrole", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 通过角色ID查询该角色拥有的所有菜单和权限详细信息
     * **/
    async findAllPowerByRoleId(params = {}) {
      try {
        const res = await axios.get(
          `api/findAllPowerByRoleId?${qs.stringify(params)}`,
          params
        );
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 获取所有的菜单及权限详细信息
     * **/
    async getAllPowers(params = {}) {
      try {
        const res = await axios.post(
          `api/getAllPowers?${qs.stringify(params)}`,
          params
        );
        if (res.status === 200) {
          this.reducerSetAllPowers(res.data);
        }
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 通过角色ID给指定角色设置菜单及权限
     * **/
    async setPowersByRoleId(params = {}) {
      try {
        const res = await axios.post("api/setPowersByRoleId", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * (批量)通过角色ID给指定角色设置菜单及权限
     * @param params [{id,menus,powers},...]
     * */
    async setPowersByRoleIds(params = {}) {
      try {
        console.log("idsaaaa:", params);
        const res = await axios.post("api/setPowersByRoleIds", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 条件分页查询用户列表
     * **/
    async getUserList(params = {}) {
      try {
        const res = await axios.get(`api/getUserList?${qs.stringify(params)}`);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 添加用户
     * **/
    async addUser(params = {}) {
      try {
        const res = await axios.post("api/addUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 修改用户
     * **/
    async upUser(params = {}) {
      try {
        const res = await axios.post("api/upUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 删除用户
     * **/
    async delUser(params = {}) {
      try {
        const res = await axios.post("api/delUser", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    },

    /**
     * 给用户分配角色
     * **/
    async setUserRoles(params = {}) {
      try {
        const res = await axios.post("api/setUserRoles", params);
        return res;
      } catch (err) {
        message.error("网络错误，请重试");
      }
    }
  })
};

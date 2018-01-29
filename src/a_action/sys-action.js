/**
 * 系统模块action
 * **/
import Fetchapi from '../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import { message } from 'antd';


/**
 * 获取所有菜单
 * **/
export const getMenus = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getmenus', params);
        console.log('这res是什么：', res);
        if(res.data.status === 200) {
            await dispatch({
                type: 'SYS.getMenus',
                payload: res.data.data,
            });
        }
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加菜单
 * @params: {
    'name',
    'url',
    'parent',
    'icon',
    'desc',
    'sorts',
    'conditions',
  * }
 * **/
export const addMenu = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/addmenu', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改菜单
 * **/
export const upMenu = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/upmenu', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除菜单
 * **/
export const delMenu = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/delmenu', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 根据菜单ID查询其下的权限数据
 * **/
export const getPowerDataByMenuId = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getpowerbymenuid', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加权限
 * **/
export const addPower = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/addpower', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改权限
 * **/
export const upPower = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/uppower', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除权限
 * **/
export const delPower = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/delpower', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 分页查询角色数据
 * **/
export const getRoles = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getroles', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加角色
 * **/
export const addRole = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/addrole', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改角色
 * **/
export const upRole = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/uprole', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除角色
 * **/
export const delRole = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/delrole', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 通过角色ID查询该角色拥有的所有菜单和权限详细信息
 * **/
export const findAllPowerByRoleId = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/findAllPowerByRoleId', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};


/**
 * 获取所有的菜单及权限详细信息
 * **/
export const getAllPowers = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getAllPowers', params);
        if(res.data.status === 200) {
            await dispatch({
                type: 'SYS.getAllPowers',
                payload: res.data.data,
            });
        }
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
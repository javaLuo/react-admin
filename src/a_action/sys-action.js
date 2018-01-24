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
export const getRoleDataByMenuId = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getrolebymenuid', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加权限
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
 * 修改权限
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
 * 删除权限
 * **/
export const delRole = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/delrole', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
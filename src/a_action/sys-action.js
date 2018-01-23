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
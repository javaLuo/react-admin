/**
  一些公共的action可以写在这里，比如用户登录、退出登录、权限查询等
  其他的action可以按模块不同，创建不同的js文件
**/

import Fetchapi from '../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import { message } from 'antd';

/** 测试页：num数据测试 **/
export const onTestAdd = (num) => async(dispatch) => {
  dispatch({
    type: 'TEST::add',
    payload: ++num,
  });
};

/**
 * 登录
 * @params: { username, password }
 * **/
export const onLogin = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/login', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 退出登录
 * @params: null
 * **/
export const onLogout = (params = {}) => async(dispatch) => {
    try {
        await dispatch({
            type: 'APP.onLogout',
            payload: null,
        });
        sessionStorage.removeItem('userinfo');
        return 'success';
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 设置用户信息
 * @params: userinfo
 * **/
export const setUserInfo = (params = {}) => async(dispatch) => {
    try {
        await dispatch({
            type: 'APP.setUserInfo',
            payload: params,
        });
        return 'success';
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 获取头部用户消息
 * @params: { username, password }
 * **/
export const getNews = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getnews', params);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除头部用户消息
 * @params: { type }
 * **/
export const clearNews = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/clearnews', params);
        console.log('得到了什么：', res.data);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
/**
 * 获取用户消息的总数
 * @params: { type }
 * **/
export const getNewsTotal = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newFetch('api/getnewstotal', params);
        console.log('得到了什么：', res.data);
        return res.data;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
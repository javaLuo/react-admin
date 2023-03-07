/** 对axios做一些配置 **/

import { baseUrl } from "../config";
import axios from "axios";

/**
 * MOCK模拟数据
 * 不需要下面这些mock配置，仅本地用
 * 正式打包需要去掉
 * */
import Mock from "mockjs";
// @ts-ignore
import mock from "../../mock/app-data.js";
Mock.mock(/\/api.*/, (options: any) => {
  const res = mock(options);
  return res;
});

/**
 * 根据不同环境设置不同的请求地址
 * 把返回值赋给axios.defaults.baseURL即可
 */
// function setBaseUrl(){
//   switch(process.env.NODE_ENV){
//     case 'development': return 'http://development.com';
//     case 'test': return 'http://test.com';
//     case 'production' : return 'https://production.com';
//     default : return baseUrl;
//   }
// }

// 默认基础请求地址
axios.defaults.baseURL = baseUrl;
// 请求是否带上cookie
axios.defaults.withCredentials = false;
// 对返回的结果做处理
axios.interceptors.response.use((response) => {
  // const code = response?.data?.code ?? 200;
  // 没有权限，登录超时，登出，跳转登录
  // if (code === 3) {
  //   message.error("登录超时，请重新登录");
  //   sessionStorage.removeItem("userinfo");
  //   setTimeout(() => {
  //     window.location.href = "/";
  //   }, 1500);
  // } else {
  //   return response.data;
  // }
  return response.data;
});

export default axios;

/** 这里面都是自己定义的Hooks **/

import { useState, useEffect } from "react";

/**
 * 分页相关参数统一管理
 * @param initNum 起始页码
 * @param initSize 每页显示多少条数据
 */
export function usePage(initNum = 1, initSize = 10) {
  const [pageInfo, setPageInfo] = useState({
    pageNum: initNum,
    pageSize: initSize,
    total: 0,
  });

  const setPage = (params = {}) => {
    setPageInfo({
      ...pageInfo,
      ...params,
    });
  };

  return {
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    total: pageInfo.total,
    setPage,
  };
}

// 模态框相关参数统一管理
export function useModal() {
  const [operateType, setOperateType] = useState("add"); // 操作类型 add新增，up修改, see查看
  const [nowData, setNowData] = useState(null); // 当前选中用户的信息，用于查看详情、修改、分配菜单
  const [modalShow, setModalShow] = useState(false); // 添加/修改/查看 模态框是否显示
  const [modalLoading, setModalLoading] = useState(false); // 模态框loading状态

  const arr = {
    operateType: setOperateType,
    nowData: setNowData,
    modalShow: setModalShow,
    modalLoading: setModalLoading,
  };

  const setModal = (params = {}) => {
    Object.entries(params).forEach((item) => {
      arr[item[0]](item[1]);
    });
  };

  return {
    operateType,
    nowData,
    modalShow,
    modalLoading,
    setModal,
  };
}

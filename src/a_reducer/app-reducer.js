/** 通用reducer **/

const initState = {
  num: 0,           // 页面测试数据 初始值0
  fetchvalue: [],   // 异步测试数据
};

// ============================================
// action handling function

const actDefault = (state) => state;

const testAdd = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    num: payload,
  });
};


const testFetch = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    fetchvalue: payload,
  });
};
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
  switch (action.type) {
  case 'TEST::add':       // 测试页 - 按钮点击出发num改变
    return testAdd(state, action);
  case 'TEST::testFetch': // 测试页 - 保存异步请求的数据
    return testFetch(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;

/** 通用reducer **/

const initState = {
  userinfo: null, // 用户信息(登录后用户基本信息、角色、菜单、权限 均保存在此，供全局调用)
};


const actDefault = (state) => state;

const onLogout = (state, { payload }) => {
  return Object.assign({}, state, {
      userinfo: null,
  });
};

const setUserInfo = (state, { payload }) => {
  return Object.assign({}, state, {
      userinfo: payload,
  });
};

const reducerFn = (state = initState, action) => {
  switch (action.type) {
  case 'APP.onLogout':  // 退出登录，清除用户信息
    return onLogout(state, action);
  case 'APP.setUserInfo': // 设置用户信息，登录成功时、同步sessionStorage中的用户信息时 触发
    return setUserInfo(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;

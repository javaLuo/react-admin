/** 通用reducer **/

const initState = {
  userinfo: null, // 用户信息
};


const actDefault = (state) => state;

const onLogin = (state, { payload }) => {
  return Object.assign({}, state, {
      userinfo: payload,
  });
};

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
  case 'APP.onLogin':   // 登录成功时触发，保存用户信息
    return onLogin(state, action);
  case 'APP.onLogout':  // 退出登录，清除用户信息
    return onLogout(state, action);
  case 'APP.setUserInfo': // 设置用户信息，用于同步sessionStorage中的用户信息到store
    return setUserInfo(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;

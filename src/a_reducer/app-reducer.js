/** 通用reducer **/

const initState = {
  userinfo: null, // 当前用户基本信息
  menus: [],      // 当前用户所有已授权的菜单
  roles: [],      // 当前用户拥有的所有角色
  powers: [],     // 当前用户拥有的权限code列表，页面中的按钮的权限控制将根据此数据源判断
};


const actDefault = (state) => state;

const onLogout = (state, { payload }) => {
  return Object.assign({}, state, {
      userinfo: null,
      menus: [],
      roles: [],
      powers: [],
  });
};

const setUserInfo = (state, { payload }) => {
  console.log('来了没：userinfo', payload);
  return Object.assign({}, state, {
      userinfo: payload.userInfo,
      menus: payload.menus,
      roles: payload.roles,
      powers: payload.powers.map((item) => item.code),
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

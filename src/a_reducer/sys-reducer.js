/** 通用reducer **/

const initState = {
    menus: [], // 用户信息
};


const actDefault = (state) => state;

const getMenus = (state, { payload }) => {
    return Object.assign({}, state, {
        menus: payload,
    });
};


const reducerFn = (state = initState, action) => {
    switch (action.type) {
        case 'SYS.getMenus':   // 登录成功时触发，保存用户信息
            return getMenus(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;

/** 通用reducer **/

const initState = {
    menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
    powerTreeData: [],  // 分配权限treeTable组件所需原始数据
};


const actDefault = (state) => state;

const getMenus = (state, { payload }) => {
    return Object.assign({}, state, {
        menus: payload,
    });
};

const getAllPowers = (state, { payload }) => {
    return Object.assign({}, state, {
        powerTreeData: payload,
    });
};


const reducerFn = (state = initState, action) => {
    switch (action.type) {
        case 'SYS.getMenus':   // 登录成功时触发，保存用户信息
            return getMenus(state, action);
        case 'SYS.getAllPowers': // 获取所有菜单权限数据 - 用于构建分配权限tree数据
            return getAllPowers(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;

import Mock from 'mockjs';

Mock.setup({
    timeout: '200-1000',
});

/**
 * 模拟数据
 * **/
// ID序列
let id_sequence = 1000;

// 用户数据
const users = [
    { id: 1, username: 'admin', password: '123456' },
    { id: 2, username: 'user', password: '123456'}
];

// 头部消息数据
const msg = {
    notice: [   // 通知数据
        {title: '你收到了14份新周报', time: '昨天', icon: 'mail', color: '#FE5D58'},
        {title: '国庆节放假安排', time: '今天上午', icon: 'star', color: '#3391E5'},
        {title: 'leader 将你添加到开发小组', time: '今天上午', icon: 'team', color: '#9DDEDE'},
    ],
    message: [  // 消息数据
        {title: '小明回复了你', time: '昨天', info: '最新的代码已经提交至git，请拉取更新', icon: 'smile-o', color: '#FE5D58'},
        {title: '小红评论了你', time: '今天上午', info: '之前封装的组件可以正常使用，兼容性没有问题哦', icon: 'smile-o', color: '#3391E5'},
    ],
    work: [ // 待办数据
        {title: '新系统部署', info: '服务器环境已经搭建完毕，需要下一步部署', type:'未开始', color:''},
        {title: '需求变更', info: '需求又TM变啦，哥，改一下咯', type:'进行中', color: 'blue'},
        {title: 'A版本代码合并', info: 'git上的分支需合并至master', type:'已完成', color: 'geekblue'},
    ]
};

// 所有的菜单数据
const menus = [
    { id: 1, title: '系统管理', icon: 'edit', url: 'system', parent: null, desc: '系统管理目录分支', sorts: 0, conditions: 1  },
    { id: 2, title: '用户管理', icon: 'user', url: 'consumer', parent: 1, desc: '系统管理/用户管理', sorts: 0, conditions: 1  },
    { id: 3, title: '角色管理', icon: 'user', url: 'role', parent: 1, desc: '系统管理/角色管理', sorts: 1, conditions: 1  },
    { id: 4, title: '权限管理', icon: 'user', url: 'power', parent: 1, desc: '系统管理/权限管理', sorts: 2, conditions: 1  },
    { id: 5, title: '菜单管理', icon: 'menu', url: 'menuadmin', parent: 1, desc: '系统管理/菜单管理', sorts: 3, conditions: 1  },
];

// 所有的权限数据
const powers = [
    { id: 1, menu: 2, title: '新增', code: 'add', desc: '用户管理 - 添加权限', sorts: 1, conditions: 1 },
    { id: 2, menu: 2, title: '修改', code: 'up', desc: '用户管理 - 修改权限', sorts: 2, conditions: 1 },
    { id: 3, menu: 2, title: '查看', code: 'see', desc: '用户管理 - 查看权限', sorts: 3, conditions: -1 },
];
// 所有的角色数据
const roles = [
    { id: 1, title: '超级管理员', desc: '超级管理员拥有所有权限', sorts: 1, conditions: 1, powers: [{ menuId: 1, powers: [] }, { menuId:2, powers:[1,2,3] }] },
    { id: 2, title: '管理员', desc: '普通管理员', sorts: 2, conditions: 1,  menus: [1,3,4,5], powers: [] },
    { id: 3, title: '运维人员', desc: '运维人员不能删除对象', sorts: 3, conditions: 1,  menus: [1,5], powers: [] },
];
/**
 * 方法
 * **/
// 登录
const onLogin = (request) => {
    const p = JSON.parse(request.body);
    console.log(p, users);
    const u = users.find((item, index) => {
        return item.username === p.username;
    });
    if (!u){
        return { status: 204, data: null, message: '该用户不存在' };
    } else if (u.password !== p.password) {
        return { status: 204, data: null, message: '密码错误' };
    }
    return { status: 200, data: u, message: '登录成功' };
};
// 删除消息数据
const clearNews = (request) => {
    const p = JSON.parse(request.body);
    switch(p.type){
        case 'notice': msg.notice.length = 0;break;
        case 'message': msg.message.length = 0;break;
        case 'work': msg.work.length = 0;break;
    }
    return { status: 200, data: msg, total: msg.notice.length + msg.message.length + msg.work.length, message: '删除成功' };
};
// 获取所有菜单
const getMenus = (request) => {
    return { status: 200, data: menus, message: 'success' };
};
// 添加新菜单
const addMenu = (request) => {
    const p = JSON.parse(request.body);
    console.log('添加：', p);
    p.id = ++id_sequence;
    menus.push(p);
    return { status: 200, data: menus, message: '添加成功' };
};
// 修改菜单
const upMenu = (request) => {
    const p = JSON.parse(request.body);
    console.log('到这了吗：', p);
    const oldIndex = menus.findIndex((item) => item.id === p.id);
    if (oldIndex !== -1){
        const news = Object.assign({}, menus[oldIndex], p);
        menus.splice(oldIndex, 1, news);
        return { status: 200, data: menus, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 删除菜单
const delMenu = (request) => {
    const p = JSON.parse(request.body);
    console.log('到这了吗：', p);
    const oldIndex = menus.findIndex((item) => item.id === p.id);

    if(oldIndex !== -1) {
        const haveChild = menus.findIndex((item) => item.parent === menus[oldIndex].id);
        if (haveChild === -1) {
            menus.splice(oldIndex, 1);
            console.log('删除之后是什么：', menus);
            return { status: 200, data: menus, message: 'success' };
        } else {
            return { status: 204, data: null, message: '该菜单下有子菜单，无法删除' };
        }
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 根据菜单ID查询其下权限
const getPowerByMenuId  = (request) => {
    const p = JSON.parse(request.body);
    const menuId = p.menuId;

    if (menuId) {
        console.log('排序后：', powers.filter((item) => item.menu === menuId).sort((a, b) => a.sorts - b.sorts));
        return { status: 200, data: powers.filter((item) => item.menu === menuId).sort((a, b) => a.sorts - b.sorts), message: 'success'};
    } else {
        return { status: 200, data: powers, message: 'success' };
    }
};
// 添加权限
const addPower = (request) => {
    const p = JSON.parse(request.body);
    p.id = ++id_sequence;
    powers.push(p);
    return { status: 200, data: null, message: 'success' };
};
// 修改权限
const upPower = (request) => {
    const p = JSON.parse(request.body);
    console.log('到这了吗：', p);
    const oldIndex = powers.findIndex((item) => item.id === p.id);
    if (oldIndex !== -1){
        const news = Object.assign({}, powers[oldIndex], p);
        powers.splice(oldIndex, 1, news);
        return { status: 200, data: null, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 删除权限
const delPower = (request) => {
    const p = JSON.parse(request.body);
    console.log('到这了吗：', p);
    const oldIndex = powers.findIndex((item) => item.id === p.id);

    if(oldIndex !== -1) {
        powers.splice(oldIndex, 1);
        return { status: 200, data: null, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 查询角色（分页,条件筛选）
const getRoles = (request) => {
    const p = JSON.parse(request.body);
    const map = roles.filter((item) => {
        let yeah = true;
        if (p.title && !item.title.includes(p.title)) {
            yeah = false;
        }
        if (p.conditions && item.conditions !== p.conditions) {
            yeah = false;
        }
        return yeah;
    });
    const r = map.sort((a, b) => a.sorts - b.sorts);
    const res = r.slice(p.pageNum * p.pageSize, (p.pageNum+1) * p.pageSize);
    return { status: 200, data: { list: res, total: roles.length }, message: 'success' };
};
// 添加角色
const addRole = (request) => {
    const p = JSON.parse(request.body);
    p.id = ++id_sequence;
    roles.push(p);
    return { status: 200, data: null, message: 'success' };
};
// 修改角色
const upRole = (request) => {
    const p = JSON.parse(request.body);
    const oldIndex = roles.findIndex((item) => item.id === p.id);
    if (oldIndex !== -1){
        const news = Object.assign({}, roles[oldIndex], p);
        roles.splice(oldIndex, 1, news);
        return { status: 200, data: null, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 删除角色
const delRole = (request) => {
    const p = JSON.parse(request.body);
    const oldIndex = roles.findIndex((item) => item.id === p.id);
    console.log('开始删除：', oldIndex);
    if(oldIndex !== -1) {
        roles.splice(oldIndex, 1);
        return { status: 200, data: null, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该条数据' };
    }
};
// 根据角色ID查询该角色所拥有的菜单和权限详细信息
const findAllPowerByRoleId = (request) => {
    const p = JSON.parse(request.body);
    const t = roles.find((item) => item.id === p.id);
    if (t) {
        const res = t.powers.map((item, index) => {
            const _menu = menus.find((v) => v.id === item.menuId);
            const _powers = item.powers.map((v) => {
                return powers.find((p) => p.id === v);
            });
            _menu.powers = _powers.filter((item) => item.conditions === 1);
            return _menu;
        });
        return { status: 200, data: res, message: 'success' };
    } else {
        return { status: 204, data: null, message: '未找到该角色' };
    }
};
// 获取所有的菜单及权限数据 - 为了构建PowerTree组件
const getAllPowers = (request) => {
    const res = menus.map((item) => {
        const _menu = item;
        const _powers = powers.filter((v) => v.menu === item.id && v.conditions === 1);
        _menu.powers = _powers;
        return _menu;
    });
    return { status: 200, data: res, message: 'success' };
};

/**
 * API拦截
 * **/
// 登录请求
Mock.mock('api/login', (params) => onLogin(params));
// 获取消息数据
Mock.mock('api/getnews', () => {return {status: 200, data: msg, total: msg.notice.length + msg.message.length + msg.work.length, message: 'success'};});
// 删除消息数据
Mock.mock('api/clearnews', (params) => clearNews(params));
// 获取消息总数
Mock.mock('api/getnewstotal', () => ({ status: 200, data: msg.notice.length + msg.message.length + msg.work.length, message: 'success' }));
// 获取所有菜单
Mock.mock('api/getmenus', (params) => getMenus(params));
// 添加菜单
Mock.mock('api/addmenu', (params) => addMenu(params));
// 修改菜单
Mock.mock('api/upmenu', (params) => upMenu(params));
// 删除菜单
Mock.mock('api/delmenu', (params) => delMenu(params));
// 根据菜单ID查询其下权限
Mock.mock('api/getpowerbymenuid', (params) => getPowerByMenuId(params));
// 添加权限
Mock.mock('api/addpower', (params) => addPower(params));
// 修改权限
Mock.mock('api/uppower', (params) => upPower(params));
// 删除权限
Mock.mock('api/delpower', (params) => delPower(params));
// 查询角色（分页）
Mock.mock('api/getroles', (params) => getRoles(params));
// 添加角色
Mock.mock('api/addrole', (params) => addRole(params));
// 修改角色
Mock.mock('api/uprole', (params) => upRole(params));
// 删除角色
Mock.mock('api/delrole', (params) => delRole(params));
// 根据角色ID查询该角色所拥有的菜单和权限详细信息
Mock.mock('api/findAllPowerByRoleId', (params) => findAllPowerByRoleId(params));
// 获取所有的菜单及权限数据 - 为了构建PowerTree组件
Mock.mock('api/getAllPowers', (params) => getAllPowers(params));

const Mock = require("mockjs");
//
// Mock.setup({
//     timeout: '0-500',
// });

/**
 * 模拟数据
 * **/
// ID序列
let id_sequence = 1000;

// 所有的用户数据
const users = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    phone: "13600000000",
    email: "admin@react.com",
    desc: "超级管理员",
    conditions: 1,
    roles: [1, 2, 3]
  },
  {
    id: 2,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员",
    conditions: 1,
    roles: [2]
  }
];

// 头部消息数据
const msg = {
  notice: [
    // 通知数据
    {
      title: "你收到了12份新需求变更",
      time: "昨天",
      icon: "mail",
      color: "#FE5D58"
    },
    {
      title: "公告：国庆节放假安排",
      time: "今天上午",
      icon: "star",
      color: "#3391E5"
    },
    {
      title: "leader将你添加到新的开发小组",
      time: "今天上午",
      icon: "team",
      color: "#9DDEDE"
    }
  ],
  message: [
    // 消息数据
    {
      title: "大神回复了你",
      time: "昨天",
      info: "版本更新了，你去参考一下分支A的代码",
      icon: "smile-o",
      color: "#3391E5"
    },
    {
      title: "测试员小红评论了你",
      time: "今天上午",
      info: "大佬，那确实不是一个BUG，是我考虑不周，见谅，下午请你喝奶茶",
      icon: "smile-o",
      color: "#FE5D58"
    }
  ],
  work: [
    // 待办数据
    {
      title: "系统部署",
      info: "服务器环境已经搭建完毕，需要下一步部署",
      type: "未开始",
      color: ""
    },
    {
      title: "需求变更",
      info: "今早有6个优先级高的需求改动",
      type: "进行中",
      color: "blue"
    },
    {
      title: "分支A代码合并",
      info: "git上的分支需合并至master",
      type: "已完成",
      color: "geekblue"
    }
  ]
};

// 所有的菜单数据
const menus = [
  {
    id: 1,
    title: "首页",
    icon: "home",
    url: "/home",
    parent: null,
    desc: "首页",
    sorts: 0,
    conditions: 1
  },
  {
    id: 2,
    title: "系统管理",
    icon: "setting",
    url: "/system",
    parent: null,
    desc: "系统管理目录分支",
    sorts: 1,
    conditions: 1
  },
  {
    id: 3,
    title: "用户管理",
    icon: "user",
    url: "/useradmin",
    parent: 2,
    desc: "系统管理/用户管理",
    sorts: 0,
    conditions: 1
  },
  {
    id: 4,
    title: "角色管理",
    icon: "team",
    url: "/roleadmin",
    parent: 2,
    desc: "系统管理/角色管理",
    sorts: 1,
    conditions: 1
  },
  {
    id: 5,
    title: "权限管理",
    icon: "coffee",
    url: "/poweradmin",
    parent: 2,
    desc: "系统管理/权限管理",
    sorts: 2,
    conditions: 1
  },
  {
    id: 6,
    title: "菜单管理",
    icon: "appstore",
    url: "/menuadmin",
    parent: 2,
    desc: "系统管理/菜单管理",
    sorts: 3,
    conditions: 1
  }
];

// 所有的权限数据
const powers = [
  {
    id: 1,
    menu: 3,
    title: "新增",
    code: "user:add",
    desc: "用户管理 - 添加权限",
    sorts: 1,
    conditions: 1
  },
  {
    id: 2,
    menu: 3,
    title: "修改",
    code: "user:up",
    desc: "用户管理 - 修改权限",
    sorts: 2,
    conditions: 1
  },
  {
    id: 3,
    menu: 3,
    title: "查看",
    code: "user:query",
    desc: "用户管理 - 查看权限",
    sorts: 3,
    conditions: 1
  },
  {
    id: 4,
    menu: 3,
    title: "删除",
    code: "user:del",
    desc: "用户管理 - 删除权限",
    sorts: 4,
    conditions: 1
  },
  {
    id: 5,
    menu: 3,
    title: "分配角色",
    code: "user:role",
    desc: "用户管理 - 分配角色权限",
    sorts: 5,
    conditions: 1
  },

  {
    id: 6,
    menu: 4,
    title: "新增",
    code: "role:add",
    desc: "角色管理 - 添加权限",
    sorts: 1,
    conditions: 1
  },
  {
    id: 7,
    menu: 4,
    title: "修改",
    code: "role:up",
    desc: "角色管理 - 修改权限",
    sorts: 2,
    conditions: 1
  },
  {
    id: 8,
    menu: 4,
    title: "查看",
    code: "role:query",
    desc: "角色管理 - 查看权限",
    sorts: 3,
    conditions: 1
  },
  {
    id: 18,
    menu: 4,
    title: "分配权限",
    code: "role:power",
    desc: "角色管理 - 分配权限",
    sorts: 4,
    conditions: 1
  },
  {
    id: 9,
    menu: 4,
    title: "删除",
    code: "role:del",
    desc: "角色管理 - 删除权限",
    sorts: 5,
    conditions: 1
  },

  {
    id: 10,
    menu: 5,
    title: "新增",
    code: "power:add",
    desc: "权限管理 - 添加权限",
    sorts: 1,
    conditions: 1
  },
  {
    id: 11,
    menu: 5,
    title: "修改",
    code: "power:up",
    desc: "权限管理 - 修改权限",
    sorts: 2,
    conditions: 1
  },
  {
    id: 12,
    menu: 5,
    title: "查看",
    code: "power:query",
    desc: "权限管理 - 查看权限",
    sorts: 3,
    conditions: 1
  },
  {
    id: 13,
    menu: 5,
    title: "删除",
    code: "power:del",
    desc: "权限管理 - 删除权限",
    sorts: 2,
    conditions: 1
  },

  {
    id: 14,
    menu: 6,
    title: "新增",
    code: "menu:add",
    desc: "菜单管理 - 添加权限",
    sorts: 1,
    conditions: 1
  },
  {
    id: 15,
    menu: 6,
    title: "修改",
    code: "menu:up",
    desc: "菜单管理 - 修改权限",
    sorts: 2,
    conditions: 1
  },
  {
    id: 16,
    menu: 6,
    title: "查看",
    code: "menu:query",
    desc: "菜单管理 - 查看权限",
    sorts: 3,
    conditions: 1
  },
  {
    id: 17,
    menu: 6,
    title: "删除",
    code: "menu:del",
    desc: "菜单管理 - 删除权限",
    sorts: 2,
    conditions: 1
  }
];
// 所有的角色数据
const roles = [
  {
    id: 1,
    title: "超级管理员",
    desc: "超级管理员拥有所有权限",
    sorts: 1,
    conditions: 1,
    powers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [1, 2, 3, 4, 5] },
      { menuId: 4, powers: [6, 7, 8, 9, 18] },
      { menuId: 5, powers: [10, 11, 12, 13] },
      { menuId: 6, powers: [14, 15, 16, 17] }
    ]
  },
  {
    id: 2,
    title: "普通管理员",
    desc: "普通管理员",
    sorts: 2,
    conditions: 1,
    powers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [3] },
      { menuId: 4, powers: [6, 7, 8, 18] },
      { menuId: 5, powers: [10, 11, 12] },
      { menuId: 6, powers: [14, 15, 16] }
    ]
  },
  {
    id: 3,
    title: "运维人员",
    desc: "运维人员不能删除对象",
    sorts: 3,
    conditions: 1,
    powers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [3] },
      { menuId: 4, powers: [7, 8] },
      { menuId: 5, powers: [11, 12] },
      { menuId: 6, powers: [15, 16] }
    ]
  }
];

/**
 * 方法
 * **/
// 登录
const onLogin = p => {
  const u = users.find(item => {
    return item.username === p.username;
  });
  if (!u) {
    return { status: 204, data: null, message: "该用户不存在" };
  } else if (u.password !== p.password) {
    return { status: 204, data: null, message: "密码错误" };
  }
  return { status: 200, data: u, message: "登录成功" };
};
// 删除消息数据
const clearNews = p => {
  // const p = JSON.parse(request.body);
  switch (p.type) {
    case "notice":
      msg.notice.length = 0;
      break;
    case "message":
      msg.message.length = 0;
      break;
    case "work":
      msg.work.length = 0;
      break;
  }
  return {
    status: 200,
    data: msg,
    total: msg.notice.length + msg.message.length + msg.work.length,
    message: "删除成功"
  };
};
// 获取所有菜单
const getMenus = p => {
  return { status: 200, data: menus, message: "success" };
};
// 获取菜单（根据ID）
const getMenusById = p => {
  // const p = JSON.parse(request.body);
  let res = [];
  if (p.id instanceof Array) {
    res = menus.filter(item => p.id.includes(item.id));
  } else {
    const t = menus.find(item => item.id === p.id);
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};

// 添加新菜单
const addMenu = p => {
  // const p = JSON.parse(request.body);
  console.log("添加：", p);
  p.id = ++id_sequence;
  menus.push(p);
  return { status: 200, data: menus, message: "添加成功" };
};
// 修改菜单
const upMenu = p => {
  // const p = JSON.parse(request.body);
  console.log("到这了吗：", p);
  const oldIndex = menus.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    const news = Object.assign({}, menus[oldIndex], p);
    menus.splice(oldIndex, 1, news);
    return { status: 200, data: menus, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除菜单
const delMenu = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = menus.findIndex(item => item.id === p.id);

  if (oldIndex !== -1) {
    const haveChild = menus.findIndex(
      item => item.parent === menus[oldIndex].id
    );
    if (haveChild === -1) {
      menus.splice(oldIndex, 1);
      return { status: 200, data: menus, message: "success" };
    } else {
      return { status: 204, data: null, message: "该菜单下有子菜单，无法删除" };
    }
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 根据菜单ID查询其下权限
const getPowerByMenuId = p => {
  // const p = JSON.parse(request.body);
  const menuId = p.menuId;

  if (menuId) {
    console.log(
      "排序后：",
      powers
        .filter(item => item.menu === menuId)
        .sort((a, b) => a.sorts - b.sorts)
    );
    return {
      status: 200,
      data: powers
        .filter(item => item.menu === menuId)
        .sort((a, b) => a.sorts - b.sorts),
      message: "success"
    };
  } else {
    return { status: 200, data: [], message: "success" };
  }
};
// 根据权限ID查询对应的权限
const getPowerById = p => {
  // const p = JSON.parse(request.body);
  let res = [];
  console.log("开始查权限了，都有什么：", p);
  if (p.id instanceof Array) {
    res = powers.filter(item => p.id.includes(item.id));
  } else {
    const t = powers.find(item => item.id === p.id);
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};
// 添加权限
const addPower = p => {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  powers.push(p);
  return { status: 200, data: null, message: "success" };
};
// 修改权限
const upPower = p => {
  // const p = JSON.parse(request.body);
  console.log("到这了吗：", p);
  const oldIndex = powers.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    const news = Object.assign({}, powers[oldIndex], p);
    powers.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除权限
const delPower = p => {
  // const p = JSON.parse(request.body);
  console.log("到这了吗：", p);
  const oldIndex = powers.findIndex(item => item.id === p.id);

  if (oldIndex !== -1) {
    powers.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 查询角色（分页,条件筛选）
const getRoles = p => {
  // const p = JSON.parse(request.body);
  const map = roles.filter(item => {
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
  const res = r.slice(p.pageNum * p.pageSize, (p.pageNum + 1) * p.pageSize);
  return {
    status: 200,
    data: { list: res, total: roles.length },
    message: "success"
  };
};
// 查询角色（所有）
const getAllRoles = p => {
  return { status: 200, data: roles, message: "success" };
};
// 查询角色（通过角色ID）
const getRoleById = p => {
  // const p = JSON.parse(request.body);
  let res = [];
  if (p.id instanceof Array) {
    res = roles.filter(item => p.id.includes(item.id));
  } else {
    const t = roles.find(item => item.id === p.id);
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};
// 添加角色
const addRole = p => {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  roles.push(p);
  return { status: 200, data: null, message: "success" };
};
// 修改角色
const upRole = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    const news = Object.assign({}, roles[oldIndex], p);
    roles.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除角色
const delRole = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(item => item.id === p.id);
  console.log("开始删除：", oldIndex);
  if (oldIndex !== -1) {
    roles.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 根据角色ID查询该角色所拥有的菜单和权限详细信息
const findAllPowerByRoleId = p => {
  // const p = JSON.parse(request.body);
  const t = roles.find(item => item.id === p.id);
  if (t) {
    const res = t.powers.map((item, index) => {
      const _menu = menus.find(v => v.id === item.menuId);
      const _powers = item.powers.map(v => {
        return powers.find(p => p.id === v);
      });
      _menu.powers = _powers.filter(item => item.conditions === 1);
      return _menu;
    });
    return { status: 200, data: res, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该角色" };
  }
};
// 获取所有的菜单及权限数据 - 为了构建PowerTree组件
const getAllPowers = p => {
  const res = menus.map(item => {
    const _menu = item;
    const _powers = powers.filter(
      v => v.menu === item.id && v.conditions === 1
    );
    _menu.powers = _powers;
    return _menu;
  });
  return { status: 200, data: res, message: "success" };
};
// 给指定角色分配菜单和权限
const setPowersByRoleId = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    let pow = p.menus.map(item => ({ menuId: item, powers: [] }));
    console.log("此时的POW", pow);
    pow.filter(item => {
      const parr = p.powers.filter(v => {
        return powers.findIndex(pv => pv.menu === item.menuId) > -1;
      });
      item.powers = parr;
    });
    console.log("最终的POW：", pow);
    roles[oldIndex].powers = pow;
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 条件分页查询用户列表
const getUserList = p => {
  // const p = JSON.parse(request.body);
  const map = users.filter(item => {
    let yeah = true;
    if (p.username && !item.username.includes(p.username)) {
      yeah = false;
    }
    if (p.conditions && item.conditions !== p.conditions) {
      yeah = false;
    }
    return yeah;
  });
  const res = map.slice(p.pageNum * p.pageSize, (p.pageNum + 1) * p.pageSize);
  return {
    status: 200,
    data: { list: res, total: roles.length },
    message: "success"
  };
};
// 添加用户
const addUser = p => {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  users.push(p);
  return { status: 200, data: null, message: "success" };
};
// 修改用户
const upUser = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = users.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    const news = Object.assign({}, users[oldIndex], p);
    users.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除用户
const delUser = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = users.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    users.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 给用户分配角色
const setUserRoles = p => {
  // const p = JSON.parse(request.body);
  const oldIndex = users.findIndex(item => item.id === p.id);
  if (oldIndex !== -1) {
    users.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};

exports.mockApi = (url, params) => {
  console.log("调用API：", url, params);
  switch (url) {
    case "/api/login":
      return onLogin(params);
    case "/api/getnews":
      return {
        status: 200,
        data: msg,
        total: msg.notice.length + msg.message.length + msg.work.length,
        message: "success"
      };
    case "/api/clearnews":
      return clearNews(params);
    case "/api/getnewstotal":
      return {
        status: 200,
        data: msg.notice.length + msg.message.length + msg.work.length,
        message: "success"
      };
    case "/api/getmenus":
      return getMenus(params);
    case "/api/getMenusById":
      return getMenusById(params);
    case "/api/addmenu":
      return addMenu(params);
    case "/api/upmenu":
      return upMenu(params);
    case "/api/delmenu":
      return delMenu(params);
    case "/api/getpowerbymenuid":
      return getPowerByMenuId(params);
    case "/api/getPowerById":
      return getPowerById(params);
    case "/api/addpower":
      return addPower(params);
    case "/api/uppower":
      return upPower(params);
    case "/api/delpower":
      return delPower(params);
    case "/api/getroles":
      return getRoles(params);
    case "/api/getAllRoles":
      return getAllRoles(params);
    case "/api/getRoleById":
      return getRoleById(params);
    case "/api/addrole":
      return addRole(params);
    case "/api/uprole":
      return upRole(params);
    case "/api/delrole":
      return delRole(params);
    case "/api/findAllPowerByRoleId":
      return findAllPowerByRoleId(params);
    case "/api/getAllPowers":
      return getAllPowers(params);
    case "/api/setPowersByRoleId":
      return setPowersByRoleId(params);
    case "/api/getUserList":
      return getUserList(params);
    case "/api/addUser":
      return addUser(params);
    case "/api/upUser":
      return upUser(params);
    case "/api/delUser":
      return delUser(params);
    case "/api/setUserRoles":
      return setUserRoles(params);
    default:
      return { status: 404, data: null, message: "api not found" };
  }
};
/**
 * API拦截
 * **/
// // 登录请求
// Mock.mock('api/login', (params) => onLogin(params));
// // 获取消息数据
// Mock.mock('api/getnews', () => {return {status: 200, data: msg, total: msg.notice.length + msg.message.length + msg.work.length, message: 'success'};});
// // 删除消息数据
// Mock.mock('api/clearnews', (params) => clearNews(params));
// // 获取消息总数
// Mock.mock('api/getnewstotal', () => ({ status: 200, data: msg.notice.length + msg.message.length + msg.work.length, message: 'success' }));
// // 获取所有菜单
// Mock.mock('api/getmenus', (params) => getMenus(params));
// // 获取菜单（根据ID）
// Mock.mock('api/getMenusById', (params) => getMenusById(params));
// // 添加菜单
// Mock.mock('api/addmenu', (params) => addMenu(params));
// // 修改菜单
// Mock.mock('api/upmenu', (params) => upMenu(params));
// // 删除菜单
// Mock.mock('api/delmenu', (params) => delMenu(params));
// // 根据菜单ID查询其下权限
// Mock.mock('api/getpowerbymenuid', (params) => getPowerByMenuId(params));
// // 根据权限ID查询对应的权限
// Mock.mock('api/getPowerById', (params) => getPowerById(params));
// // 添加权限
// Mock.mock('api/addpower', (params) => addPower(params));
// // 修改权限
// Mock.mock('api/uppower', (params) => upPower(params));
// // 删除权限
// Mock.mock('api/delpower', (params) => delPower(params));
// // 查询角色（分页）
// Mock.mock('api/getroles', (params) => getRoles(params));
// // 查询角色（所有）
// Mock.mock('api/getAllRoles', (params) => getAllRoles(params));
// // 查询角色（通过角色ID）
// Mock.mock('api/getRoleById', (params) => getRoleById(params));
// // 添加角色
// Mock.mock('api/addrole', (params) => addRole(params));
// // 修改角色
// Mock.mock('api/uprole', (params) => upRole(params));
// // 删除角色
// Mock.mock('api/delrole', (params) => delRole(params));
// // 根据角色ID查询该角色所拥有的菜单和权限详细信息
// Mock.mock('api/findAllPowerByRoleId', (params) => findAllPowerByRoleId(params));
// // 获取所有的菜单及权限数据 - 为了构建PowerTree组件
// Mock.mock('api/getAllPowers', (params) => getAllPowers(params));
// // 给指定角色分配菜单和权限
// Mock.mock('api/setPowersByRoleId', (params) => setPowersByRoleId(params));
// // 条件分页查询用户列表
// Mock.mock('api/getUserList', (params) => getUserList(params));
// // 添加用户
// Mock.mock('api/addUser', (params) => addUser(params));
// // 修改用户
// Mock.mock('api/upUser', (params) => upUser(params));
// // 删除用户
// Mock.mock('api/delUser', (params) => delUser(params));
// // 给用户分配角色
// Mock.mock('api/setUserRoles', (params) => setUserRoles(params));

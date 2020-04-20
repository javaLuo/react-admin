// 不需要下面这几行，只是本地发布DEMO用
// const Mock = require("mockjs");
// Mock.setup({
//   timeout: "0-500",
// });

/**
 * 模拟数据
 * 这个文件使用了兼容IE11的语法，
 * 也没有弄成ts,因为server.js中要用到此文件
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
    roles: [1, 2, 3],
  },
  {
    id: 2,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员",
    conditions: 1,
    roles: [2],
  },
  {
    id: 3,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员3",
    conditions: 1,
    roles: [2],
  },
  {
    id: 4,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员4",
    conditions: 1,
    roles: [2],
  },
  {
    id: 5,
    username: "user",
    password: "123456",
    phone: "13600000001",
    email: "user@react.com",
    desc: "普通管理员5",
    conditions: 1,
    roles: [2],
  },
];

// 所有的菜单数据
const menus = [
  {
    id: 1,
    title: "首页",
    icon: "icon-home",
    url: "/home",
    parent: null,
    desc: "首页",
    sorts: 0,
    conditions: 1,
  },
  {
    id: 2,
    title: "系统管理",
    icon: "icon-setting",
    url: "/system",
    parent: null,
    desc: "系统管理目录分支",
    sorts: 1,
    conditions: 1,
  },
  {
    id: 3,
    title: "用户管理",
    icon: "icon-user",
    url: "/useradmin",
    parent: 2,
    desc: "系统管理/用户管理",
    sorts: 0,
    conditions: 1,
  },
  {
    id: 4,
    title: "角色管理",
    icon: "icon-team",
    url: "/roleadmin",
    parent: 2,
    desc: "系统管理/角色管理",
    sorts: 1,
    conditions: 1,
  },
  {
    id: 5,
    title: "权限管理",
    icon: "icon-safetycertificate",
    url: "/poweradmin",
    parent: 2,
    desc: "系统管理/权限管理",
    sorts: 2,
    conditions: 1,
  },
  {
    id: 6,
    title: "菜单管理",
    icon: "icon-appstore",
    url: "/menuadmin",
    parent: 2,
    desc: "系统管理/菜单管理",
    sorts: 3,
    conditions: 1,
  },
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
    conditions: 1,
  },
  {
    id: 2,
    menu: 3,
    title: "修改",
    code: "user:up",
    desc: "用户管理 - 修改权限",
    sorts: 2,
    conditions: 1,
  },
  {
    id: 3,
    menu: 3,
    title: "查看",
    code: "user:query",
    desc: "用户管理 - 查看权限",
    sorts: 3,
    conditions: 1,
  },
  {
    id: 4,
    menu: 3,
    title: "删除",
    code: "user:del",
    desc: "用户管理 - 删除权限",
    sorts: 4,
    conditions: 1,
  },
  {
    id: 5,
    menu: 3,
    title: "分配角色",
    code: "user:role",
    desc: "用户管理 - 分配角色权限",
    sorts: 5,
    conditions: 1,
  },

  {
    id: 6,
    menu: 4,
    title: "新增",
    code: "role:add",
    desc: "角色管理 - 添加权限",
    sorts: 1,
    conditions: 1,
  },
  {
    id: 7,
    menu: 4,
    title: "修改",
    code: "role:up",
    desc: "角色管理 - 修改权限",
    sorts: 2,
    conditions: 1,
  },
  {
    id: 8,
    menu: 4,
    title: "查看",
    code: "role:query",
    desc: "角色管理 - 查看权限",
    sorts: 3,
    conditions: 1,
  },
  {
    id: 18,
    menu: 4,
    title: "分配权限",
    code: "role:power",
    desc: "角色管理 - 分配权限",
    sorts: 4,
    conditions: 1,
  },
  {
    id: 9,
    menu: 4,
    title: "删除",
    code: "role:del",
    desc: "角色管理 - 删除权限",
    sorts: 5,
    conditions: 1,
  },

  {
    id: 10,
    menu: 5,
    title: "新增",
    code: "power:add",
    desc: "权限管理 - 添加权限",
    sorts: 1,
    conditions: 1,
  },
  {
    id: 11,
    menu: 5,
    title: "修改",
    code: "power:up",
    desc: "权限管理 - 修改权限",
    sorts: 2,
    conditions: 1,
  },
  {
    id: 12,
    menu: 5,
    title: "查看",
    code: "power:query",
    desc: "权限管理 - 查看权限",
    sorts: 3,
    conditions: 1,
  },
  {
    id: 13,
    menu: 5,
    title: "删除",
    code: "power:del",
    desc: "权限管理 - 删除权限",
    sorts: 2,
    conditions: 1,
  },

  {
    id: 14,
    menu: 6,
    title: "新增",
    code: "menu:add",
    desc: "菜单管理 - 添加权限",
    sorts: 1,
    conditions: 1,
  },
  {
    id: 15,
    menu: 6,
    title: "修改",
    code: "menu:up",
    desc: "菜单管理 - 修改权限",
    sorts: 2,
    conditions: 1,
  },
  {
    id: 16,
    menu: 6,
    title: "查看",
    code: "menu:query",
    desc: "菜单管理 - 查看权限",
    sorts: 3,
    conditions: 1,
  },
  {
    id: 17,
    menu: 6,
    title: "删除",
    code: "menu:del",
    desc: "菜单管理 - 删除权限",
    sorts: 2,
    conditions: 1,
  },
];
// 所有的角色数据
const roles = [
  {
    id: 1,
    title: "超级管理员",
    desc: "超级管理员拥有所有权限",
    sorts: 1,
    conditions: 1,
    menuAndPowers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [1, 2, 3, 4, 5] },
      { menuId: 4, powers: [6, 7, 8, 9, 18] },
      { menuId: 5, powers: [10, 11, 12, 13] },
      { menuId: 6, powers: [14, 15, 16, 17] },
    ],
  },
  {
    id: 2,
    title: "普通管理员",
    desc: "普通管理员",
    sorts: 2,
    conditions: 1,
    menuAndPowers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [3] },
      { menuId: 4, powers: [6, 7, 8, 18] },
      { menuId: 5, powers: [10, 11, 12] },
      { menuId: 6, powers: [14, 15, 16] },
    ],
  },
  {
    id: 3,
    title: "运维人员",
    desc: "运维人员不能删除对象",
    sorts: 3,
    conditions: 1,
    menuAndPowers: [
      { menuId: 1, powers: [] },
      { menuId: 2, powers: [] },
      { menuId: 3, powers: [3] },
      { menuId: 4, powers: [7, 8] },
      { menuId: 5, powers: [11, 12] },
      { menuId: 6, powers: [15, 16] },
    ],
  },
];

/**
 * 方法
 * **/
// 登录
const onLogin = function (p) {
  const u = users.find(function (item) {
    return item.username === p.username;
  });
  if (!u) {
    return { status: 204, data: null, message: "该用户不存在" };
  } else if (u.password !== p.password) {
    return { status: 204, data: null, message: "密码错误" };
  }
  return { status: 200, data: u, message: "登录成功" };
};
// 获取所有菜单
const getMenus = function (p) {
  return { status: 200, data: menus, message: "success" };
};
// 获取菜单（根据ID）
const getMenusById = function (p) {
  // const p = JSON.parse(request.body);
  let res = [];
  if (p.id instanceof Array) {
    res = menus.filter(function (item) {
      return p.id.includes(item.id);
    });
  } else {
    const t = menus.find(function (item) {
      return item.id === p.id;
    });
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};

// 添加新菜单
const addMenu = function (p) {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  menus.push(p);
  return { status: 200, data: menus, message: "添加成功" };
};
// 修改菜单
const upMenu = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = menus.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, menus[oldIndex], p);
    menus.splice(oldIndex, 1, news);
    return { status: 200, data: menus, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除菜单
const delMenu = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = menus.findIndex(function (item) {
    return item.id === p.id;
  });

  if (oldIndex !== -1) {
    const haveChild = menus.findIndex(function (item) {
      return item.parent === menus[oldIndex].id;
    });
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
const getPowerByMenuId = function (p) {
  // const p = JSON.parse(request.body);
  const menuId = Number(p.menuId);

  if (menuId) {
    return {
      status: 200,
      data: powers
        .filter(function (item) {
          return item.menu === menuId;
        })
        .sort(function (a, b) {
          return a.sorts - b.sorts;
        }),
      message: "success",
    };
  } else {
    return { status: 200, data: [], message: "success" };
  }
};
// 根据权限ID查询对应的权限
const getPowerById = function (p) {
  // const p = JSON.parse(request.body);
  let res = [];
  if (p.id instanceof Array) {
    res = powers.filter(function (item) {
      return p.id.includes(item.id);
    });
  } else {
    const t = powers.find(function (item) {
      return item.id === p.id;
    });
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};
// 添加权限
const addPower = function (p) {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  powers.push(p);
  return { status: 200, data: { id: p.id }, message: "success" };
};
// 修改权限
const upPower = function (p) {
  // const p = JSON.parse(request.body);

  const oldIndex = powers.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, powers[oldIndex], p);
    powers.splice(oldIndex, 1, news);
    return { status: 200, data: { id: p.id }, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除权限
const delPower = function (p) {
  const oldIndex = powers.findIndex(function (item) {
    return item.id === p.id;
  });

  if (oldIndex !== -1) {
    powers.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 查询角色（分页,条件筛选）
const getRoles = function (p) {
  const map = roles.filter(function (item) {
    let yeah = true;
    if (p.title && !item.title.includes(p.title)) {
      yeah = false;
    }
    if (p.conditions && item.conditions != p.conditions) {
      yeah = false;
    }
    return yeah;
  });
  const r = map.sort(function (a, b) {
    return a.sorts - b.sorts;
  });
  const res = r.slice((p.pageNum - 1) * p.pageSize, p.pageNum * p.pageSize);
  return {
    status: 200,
    data: { list: res, total: map.length },
    message: "success",
  };
};
// 查询角色（所有）
const getAllRoles = function (p) {
  return { status: 200, data: roles, message: "success" };
};
// 查询角色（通过角色ID）
const getRoleById = function (p) {
  // const p = JSON.parse(request.body);
  let res = [];
  if (p.id instanceof Array) {
    res = roles.filter(function (item) {
      return p.id.includes(item.id);
    });
  } else {
    const t = roles.find(function (item) {
      return item.id === p.id;
    });
    res.push(t);
  }
  return { status: 200, data: res, message: "success" };
};
// 添加角色
const addRole = function (p) {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  if (!p.menuAndPowers) {
    p.menuAndPowers = [];
  }
  roles.push(p);
  return { status: 200, data: null, message: "success" };
};
// 修改角色
const upRole = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, roles[oldIndex], p);
    roles.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除角色
const delRole = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    roles.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 根据角色ID查询该角色所拥有的菜单和权限详细信息
const findAllPowerByRoleId = function (p) {
  // const p = JSON.parse(request.body);
  const t = roles.find(function (item) {
    return item.id === p.id;
  });
  if (t) {
    const res = t.powers.map(function (item, index) {
      const _menu = menus.find(function (v) {
        return v.id === item.menuId;
      });
      const _powers = item.powers.map(function (v) {
        return powers.find(function (p) {
          return p.id === v;
        });
      });
      _menu.powers = _powers.filter(function (item) {
        return item.conditions === 1;
      });
      return _menu;
    });
    return { status: 200, data: res, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该角色" };
  }
};
// 获取所有的菜单及权限数据 - 为了构建PowerTree组件
const getAllMenusAndPowers = function (p) {
  const res = menus.map(function (item) {
    const _menu = item;
    const _powers = powers.filter(function (v) {
      return v.menu === item.id && v.conditions === 1;
    });
    _menu.powers = _powers;
    return _menu;
  });
  return { status: 200, data: res, message: "success" };
};
// 给指定角色分配菜单和权限
const setPowersByRoleId = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = roles.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const pow = p.menus.map(function (item) {
      return { menuId: item, powers: [] };
    });
    // 将每一个权限id归类到对应的菜单里
    p.powers.forEach(function (ppItem) {
      // 通过权限id查询该权限对象
      const thePowerData = powers.find(function (pItem) {
        return pItem.id === ppItem;
      });
      if (thePowerData) {
        const theMenuId = thePowerData.menu;
        if (theMenuId) {
          const thePow = pow.find(function (powItem) {
            return powItem.menuId === theMenuId;
          });
          if (thePow) {
            thePow.powers.push(ppItem);
          }
        }
      }
    });

    roles[oldIndex].menuAndPowers = pow;
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};

// 给指定角色分配菜单和权限
const setPowersByRoleIds = function (ps) {
  ps.forEach(function (p) {
    const oldIndex = roles.findIndex(function (item) {
      return item.id === p.id;
    });
    if (oldIndex !== -1) {
      const pow = p.menus.map(function (item) {
        return { menuId: item, powers: [] };
      });
      // 将每一个权限id归类到对应的菜单里
      p.powers.forEach(function (ppItem) {
        // 通过权限id查询该权限对象
        const thePowerData = powers.find(function (pItem) {
          return pItem.id === ppItem;
        });
        if (thePowerData) {
          const theMenuId = thePowerData.menu;
          if (theMenuId) {
            const thePow = pow.find(function (powItem) {
              return powItem.menuId === theMenuId;
            });
            if (thePow) {
              thePow.powers.push(ppItem);
            }
          }
        }
      });
      roles[oldIndex].menuAndPowers = pow;
    }
  });
  return { status: 200, data: null, message: "success" };
};

// 条件分页查询用户列表
const getUserList = function (p) {
  const map = users.filter(function (item) {
    let yeah = true;
    if (p.username && !item.username.includes(p.username)) {
      yeah = false;
    }
    if (p.conditions && item.conditions != p.conditions) {
      yeah = false;
    }
    return yeah;
  });
  const pageNum = Number(p.pageNum); // 从第1页开始
  const pageSize = Number(p.pageSize);
  const res = map.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  return {
    status: 200,
    data: { list: res, total: map.length },
    message: "success",
  };
};
// 添加用户
const addUser = function (p) {
  // const p = JSON.parse(request.body);
  p.id = ++id_sequence;
  users.push(p);
  return { status: 200, data: null, message: "success" };
};
// 修改用户
const upUser = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = users.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    const news = Object.assign({}, users[oldIndex], p);
    users.splice(oldIndex, 1, news);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};
// 删除用户
const delUser = function (p) {
  // const p = JSON.parse(request.body);
  const oldIndex = users.findIndex(function (item) {
    return item.id === p.id;
  });
  if (oldIndex !== -1) {
    users.splice(oldIndex, 1);
    return { status: 200, data: null, message: "success" };
  } else {
    return { status: 204, data: null, message: "未找到该条数据" };
  }
};

exports.mockApi = function (obj) {
  const url = obj.url;
  const body = obj.body;
  let params = typeof body === "string" ? JSON.parse(body) : body;
  let path = url;

  // 是get请求 解析参数
  if (url.includes("?")) {
    path = url.split("?")[0];
    const s = url.split("?")[1].split("&"); // ['a=1','b=2']
    params = {};

    for (let i = 0; i < s.length; i++) {
      if (s[i]) {
        const ss = s[i].split("=");
        params[ss[0]] = ss[1];
      }
    }
  }
  if (path.includes("http")) {
    path = path.replace(
      globalThis.location.protocol + "//" + globalThis.location.host,
      ""
    );
  }
  console.info("请求接口：", path, params);
  switch (path) {
    case "/api/login":
      return onLogin(params);
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
    case "/api/getAllMenusAndPowers":
      return getAllMenusAndPowers(params);
    case "/api/setPowersByRoleId":
      return setPowersByRoleId(params);
    case "/api/setPowersByRoleIds":
      return setPowersByRoleIds(params);
    case "/api/getUserList":
      return getUserList(params);
    case "/api/addUser":
      return addUser(params);
    case "/api/upUser":
      return upUser(params);
    case "/api/delUser":
      return delUser(params);
    default:
      return { status: 404, data: null, message: "api not found" };
  }
};

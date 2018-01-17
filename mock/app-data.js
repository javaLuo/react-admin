import Mock from 'mockjs';

Mock.setup({
    timeout: '500-2000',
});

/**
 * 模拟数据
 * **/
const users = [
    { id: 1, username: 'admin', password: '123456' },
    { id: 2, username: 'user', password: '123456'}
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

/**
 * API拦截
 * **/
// 登录请求
Mock.mock('api/login', (params) => onLogin(params));
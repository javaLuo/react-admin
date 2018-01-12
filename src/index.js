import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Router from './router';

// babel本身只能转换ES6语法，但ES6新增的MAP、SET、Generator等新功能不会转换，所以需要此垫片库
// import 'babel-polyfill';

// 数据中心
import store from './store';

// 公共样式
import './styles/css.css';
import './styles/less.less';
import './styles/scss.scss';

const rootDom = document.getElementById('app-root');

ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>,
    rootDom
);

if (module.hot) {
    module.hot.accept();
}
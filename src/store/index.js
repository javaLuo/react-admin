/** 全局唯一数据中心 **/
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';	// 管理异步action的插件，为了使action中能够使用异步请求
// import logger from 'redux-logger';	// redux日志中间件，会记录redux的发生过程，便于debug
import RootReducer from '../a_reducer';

// 创建所需的所有中间件
const middlewares = [];
// 加入需要的中间件
middlewares.push(ReduxThunk);
// middlewares.push(logger);

const store = createStore(RootReducer, applyMiddleware(...middlewares));

// REDUX 2.x 中，HMR检测不到reducer的变化，所以在创建store的文件中加入下面代码
if(module.hot) {
    module.hot.accept('../a_reducer', () => {
        const nextRootReducer = require('../a_reducer/index');
        store.replaceReducer(nextRootReducer);
    });
}
export default store;

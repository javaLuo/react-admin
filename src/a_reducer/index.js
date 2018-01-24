/**
 * 该Reducer为根reducer, 用于结合 App 中所有的 reducer.
 * 由于Redux中必须只有一个 store 和一个 reducer ,
 * 因此不要创建多个 store！相反，使用 combineReducers 来把多个 reducer 合并成一个根 reducer。
 **/

// ============================================
// Import modules

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// ============================================
// Import app reducers
import appReducer from './app-reducer';
import sysReducer from './sys-reducer';

// ============================================
// Combine
const RootReducer = combineReducers({
  // 注意一定要加上routing: routerReducer 这是用于redux和react-router的连接
  routing: routerReducer,
  // 其他自定义的reducer
  app: appReducer, // 这里的命名，关系到container中取state对应的reducer的名字
  sys: sysReducer, // 这里的命名，关系到container中取state对应的reducer的名字
});

export default RootReducer;

/** 全局唯一数据中心 **/
import { init, RematchDispatch, RematchRootState } from "@rematch/core";

import app from "@/models/app";
import sys from "@/models/sys";
const store = init({
  models: {
    app,
    sys,
  } as RootModel,
});

export default store;

export interface RootModel {
  app: typeof app;
  sys: typeof sys;
}
export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type iRootState = RematchRootState<RootModel>;

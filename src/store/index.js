/** 全局唯一数据中心 **/
import { init } from "@rematch/core";

import app from "@/models/app";
import sys from "@/models/sys";
const store = init({
  models: {
    app,
    sys,
  },
});

export default store;

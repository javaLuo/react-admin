// 我正准备写完整的代码测试，用的jest，这里只是刚开始
import React from "react";
import renderer from "react-test-renderer";

import Component from "./index";

it("是否正常渲染：", () => {
  renderer.create(<Component />);
});

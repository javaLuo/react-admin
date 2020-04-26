// Bread组件测试
import React from "react";
import { shallow } from "enzyme";
import Component from "@/components/CanvasBack/index";

it("是否正常渲染：", () => {
  shallow(<Component col={5} row={5} />);
});

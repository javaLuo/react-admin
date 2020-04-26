// Home页测试用例
import React from "react";
import { shallow } from "enzyme";
import Component from "@/pages/Home/index";

it("是否正常渲染：", () => {
  shallow(<Component />);
});

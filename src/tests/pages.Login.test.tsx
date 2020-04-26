// Login页测试用例
import React from "react";
import { shallow, mount } from "enzyme";
import Component from "@/pages/Login/index";
import { Provider } from "react-redux";
import { createHashHistory as createHistory } from "history"; // 锚点模式的history
import { match } from "react-router-dom";
import Store from "@/store";

const history = createHistory();

const setup = () => {
  const props = {
    history: history,
    location: window.location,
    match: {} as match,
  };
  const wrapper = mount(
    <Provider store={Store}>
      <Component {...props} />
    </Provider>
  );
  return { props, wrapper };
};

it("是否正常渲染：", async () => {
  const { wrapper } = setup();
  // 如果正常渲染的话，结果中应该包含“记住密码”4个字
  expect(wrapper.text().includes("记住密码")).toBeTruthy();

  // 第1个input输入后，其值应该改变
  await wrapper
    .find("input")
    .at(0)
    .simulate("change", { target: { value: "123" } });
  expect(wrapper.find("input").at(0).prop("value")).toBe("123");

  // 密码输入后，其值应该改变
  await wrapper
    .find('input[type="password"]')
    .simulate("change", { target: { value: "123" } });
  expect(wrapper.find('input[type="password"]').prop("value")).toBe("123");
});

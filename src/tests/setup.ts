// jest通用配置，所有其他测试开始前均执行该文件的代码

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// 配置enzyme使其支持react16+ hooks
Enzyme.configure({ adapter: new Adapter() });

// 模拟match相关方法，jest的JSDOM未提供
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

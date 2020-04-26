/**
 * Jest测试配置文件
 *
 * 组件测试一般都测些什么：
 * 测组件是否成功渲染而不抛出异常，这组件本身是哪种类型的DOM，拥有哪些css class
 * 这组件在传入不同的props下是否能正确显示不同的class或DOM结构，比如传入[1,2]就应该渲染出2个DOM，传入[1,2,3]就应该渲染3个DOM
 * 模拟事件click,input等，看是否调用正确的事件，DOM是否渲染出正确的结果
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  setupFiles: ["<rootDir>/src/tests/setup.ts", "jest-canvas-mock"],
  moduleNameMapper: {
    "^@[/](.+)": "<rootDir>/src/$1",
  },
};

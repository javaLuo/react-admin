module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  moduleNameMapper: {
    "^@[/](.+)": "<rootDir>/src/$1",
  },
};

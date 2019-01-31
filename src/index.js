/** APP入口 **/
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import * as serviceWorker from "./serviceWorker";
import Router from "./router";

/** 公共样式 **/
import "./styles/css.css";
import "./styles/scss.scss";

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("app-root")
);

serviceWorker.register();

if (module.hot) {
  module.hot.accept();
}

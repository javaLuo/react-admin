/** 登录页 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import P from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import tools from "../../util/tools";
import "./index.scss";
// ==================
// 所需的所有组件
// ==================
import Vcode from "react-vcode";
import { Form, Input, Button, Icon, Checkbox, message } from "antd";
import CanvasBack from "../../a_component/CanvasBack";
import LogoImg from "../../assets/logo.png";

// ==================
// 本页面所需action
// ==================

import { onLogin, setUserInfo } from "../../a_action/app-action";
import {
  getRoleById,
  getPowerById,
  getMenusById
} from "../../a_action/sys-action";
// ==================
// Definition
// ==================
const FormItem = Form.Item;
@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators(
      { onLogin, getRoleById, getPowerById, setUserInfo, getMenusById },
      dispatch
    )
  })
)
@Form.create()
export default class LoginContainer extends React.Component {
  static propTypes = {
    location: P.any,
    history: P.any,
    form: P.any,
    actions: P.any
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 是否正在登录中
      rememberPassword: false, // 是否记住密码
      codeValue: "00000", // 当前验证码的值
      show: false // 加载完毕时触发动画
    };
  }

  componentDidMount() {
    // 进入登陆页时，判断之前是否保存了用户名和密码
    const form = this.props.form;
    let userLoginInfo = localStorage.getItem("userLoginInfo");
    if (userLoginInfo) {
      userLoginInfo = JSON.parse(userLoginInfo);
      this.setState({
        rememberPassword: true
      });
      form.setFieldsValue({
        username: userLoginInfo.username,
        password: tools.uncompile(userLoginInfo.password)
      });
    }
    if (!userLoginInfo) {
      document.getElementById("username").focus();
    } else {
      document.getElementById("vcode").focus();
    }
    this.setState({
      show: true
    });
  }

  // 用户提交登录
  onSubmit() {
    const form = this.props.form;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.setState({ loading: true });
      this.loginIn(values.username, values.password)
        .then(res => {
          if (res.status === 200) {
            message.success("登录成功");
            if (this.state.rememberPassword) {
              localStorage.setItem(
                "userLoginInfo",
                JSON.stringify({
                  username: values.username,
                  password: tools.compile(values.password) // 密码简单加密一下再存到localStorage
                })
              ); // 保存用户名和密码
            } else {
              localStorage.removeItem("userLoginInfo");
            }
            /** 将这些信息加密后存入sessionStorage,并存入store **/
            sessionStorage.setItem(
              "userinfo",
              tools.compile(JSON.stringify(res.data))
            );
            this.props.actions.setUserInfo(res.data);
            setTimeout(() => this.props.history.replace("/")); // 跳转到主页,用setTimeout是为了等待上一句设置用户信息完成
          } else {
            message.error(res.message);
          }
        })
        .finally(err => {
          this.setState({ loading: false });
        });
    });
  }

  /**
   * 执行登录
   * 这里模拟：
   * 1.登录，得到用户信息
   * 2.通过用户信息获取其拥有的所有角色信息
   * 3.通过角色信息获取其拥有的所有权限信息
   * **/
  async loginIn(username, password) {
    let userInfo = null;
    let roles = [];
    let menus = [];
    let powers = [];
    /** 1.登录 **/
    const res1 = await this.props.actions.onLogin({ username, password }); // 登录接口
    if (!res1 || res1.status !== 200) {
      // 登录失败
      return res1;
    }

    userInfo = res1.data;

    /** 2.获取角色信息 **/
    const res2 = await this.props.actions.getRoleById({ id: userInfo.roles }); // 查询所有角色信息
    if (!res2 || res2.status !== 200) {
      // 角色查询失败
      return res2;
    }

    roles = res2.data;

    /** 3.获取菜单信息 **/
    const powersTemp = roles.reduce((a, b) => [...a, ...b.powers], []);
    // 查询所有菜单信息
    const res3 = await this.props.actions.getMenusById({
      id: powersTemp.map(item => item.menuId)
    });
    if (!res3 || res3.status !== 200) {
      // 查询菜单信息失败
      return res3;
    }

    menus = res3.data;

    /** 4.获取权限信息 **/
    const res4 = await this.props.actions.getPowerById({
      id: Array.from(
        new Set(powersTemp.reduce((a, b) => [...a, ...b.powers], []))
      )
    });
    if (!res4 || res4.status !== 200) {
      // 权限查询失败
      return res4;
    }
    powers = res4.data;

    return { status: 200, data: { userInfo, roles, menus, powers } };
  }

  // 记住密码按钮点击
  onRemember(e) {
    this.setState({
      rememberPassword: e.target.checked
    });
  }

  // 验证码改变时触发
  onVcodeChange(code) {
    const form = this.props.form;
    form.setFieldsValue({
      vcode: code // 开发模式自动赋值验证码，正式环境，这里应该赋值''
    });
    this.setState({
      codeValue: code
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-login">
        <div className="canvasBox">
          <CanvasBack row={12} col={8} />
        </div>
        <div
          className={
            this.state.show ? "loginBox all_trans5 show" : "loginBox all_trans5"
          }
        >
          <Form>
            <div className="title">
              <img src={LogoImg} alt="logo" />
              <span>React-Admin</span>
            </div>
            <div>
              <FormItem>
                {getFieldDecorator("username", {
                  rules: [
                    { max: 12, message: "最大长度为12位字符" },
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入用户名"
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                    size="large"
                    id="username" // 为了获取焦点
                    placeholder="admin/user"
                    onPressEnter={() => this.onSubmit()}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "请输入密码" },
                    { max: 18, message: "最大长度18个字符" }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                    size="large"
                    type="password"
                    placeholder="123456/123456"
                    onPressEnter={() => this.onSubmit()}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("vcode", {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        const v = tools.trim(value);
                        if (v) {
                          if (v.length > 4) {
                            callback("验证码为4位字符");
                          } else if (
                            v.toLowerCase() !==
                            this.state.codeValue.toLowerCase()
                          ) {
                            callback("验证码错误");
                          } else {
                            callback();
                          }
                        } else {
                          callback("请输入验证码");
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: "200px" }}
                    size="large"
                    id="vcode" // 为了获取焦点
                    placeholder="请输入验证码"
                    onPressEnter={() => this.onSubmit()}
                  />
                )}
                <Vcode
                  height={40}
                  width={150}
                  onChange={code => this.onVcodeChange(code)}
                  className="vcode"
                  options={{
                    lines: 16
                  }}
                />
              </FormItem>
              <div style={{ lineHeight: "40px" }}>
                <Checkbox
                  className="remember"
                  checked={this.state.rememberPassword}
                  onChange={e => this.onRemember(e)}
                >
                  记住密码
                </Checkbox>
                <Button
                  className="submit-btn"
                  size="large"
                  type="primary"
                  loading={this.state.loading}
                  onClick={() => this.onSubmit()}
                >
                  {this.state.loading ? "请稍后" : "登录"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

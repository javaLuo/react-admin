/** 登录页 **/

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import tools from "@/util/tools";
import "./index.less";
// ==================
// 所需的所有组件
// ==================
import Vcode from "react-vcode";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import CanvasBack from "@/a_component/CanvasBack";
import LogoImg from "@/assets/logo.png";

@connect(
  (state) => ({}),
  (dispatch) => ({
    onLogin: dispatch.app.onLogin,
    setUserInfo: dispatch.app.setUserInfo,
    getRoleById: dispatch.sys.getRoleById,
    getPowerById: dispatch.sys.getPowerById,
    getMenusById: dispatch.sys.getMenusById,
  })
)
export default class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      loading: false, // 是否正在登录中
      rememberPassword: false, // 是否记住密码
      codeValue: "00000", // 当前验证码的值
      show: false, // 加载完毕时触发动画
    };
  }

  componentDidMount() {
    // 进入登陆页时，判断之前是否保存了用户名和密码
    let userLoginInfo = localStorage.getItem("userLoginInfo");
    if (userLoginInfo) {
      userLoginInfo = JSON.parse(userLoginInfo);
      this.setState({
        rememberPassword: true,
      });

      this.form.current.setFieldsValue({
        username: userLoginInfo.username,
        password: tools.uncompile(userLoginInfo.password),
      });
    }
    if (!userLoginInfo) {
      document.getElementById("username").focus();
    } else {
      document.getElementById("vcode").focus();
    }
    this.setState({
      show: true,
    });
  }

  // 用户提交登录
  async onSubmit() {
    try {
      const values = await this.form.current.validateFields();
      this.setState({ loading: true });
      this.loginIn(values.username, values.password)
        .then((res) => {
          if (res.status === 200) {
            message.success("登录成功");
            if (this.state.rememberPassword) {
              localStorage.setItem(
                "userLoginInfo",
                JSON.stringify({
                  username: values.username,
                  password: tools.compile(values.password), // 密码简单加密一下再存到localStorage
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
            this.props.setUserInfo(res.data);
            setTimeout(() => this.props.history.replace("/")); // 跳转到主页,用setTimeout是为了等待上一句设置用户信息完成
          } else {
            message.error(res.message);
          }
        })
        .finally((err) => {
          this.setState({ loading: false });
        });
    } catch (e) {
      // 验证未通过
    }

    return;
  }

  /**
   * 执行登录
   * 这里模拟：
   * 1.登录，得到用户信息
   * 2.通过用户信息获取其拥有的所有角色信息
   * 3.通过角色信息获取其拥有的所有权限信息
   * **/
  async loginIn(username, password) {
    let userBasicInfo = null;
    let roles = [];
    let menus = [];
    let powers = [];

    /** 1.登录 （返回信息中有该用户拥有的角色id） **/
    const res1 = await this.props.onLogin({ username, password });
    if (!res1 || res1.status !== 200) {
      // 登录失败
      return res1;
    }

    userBasicInfo = res1.data;

    /** 2.根据角色id获取角色信息 (角色信息中有该角色拥有的菜单id和权限id) **/
    const res2 = await this.props.getRoleById({ id: userBasicInfo.roles });
    if (!res2 || res2.status !== 200) {
      // 角色查询失败
      return res2;
    }

    roles = res2.data.filter((item) => item.conditions === 1); // conditions: 1启用 -1禁用

    /** 3.根据菜单id 获取菜单信息 **/
    const menuAndPowers = roles.reduce(
      (a, b) => [...a, ...b.menuAndPowers],
      []
    );
    const res3 = await this.props.getMenusById({
      id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
    });
    if (!res3 || res3.status !== 200) {
      // 查询菜单信息失败
      return res3;
    }

    menus = res3.data.filter((item) => item.conditions === 1);

    /** 4.根据权限id，获取权限信息 **/
    const res4 = await this.props.getPowerById({
      id: Array.from(
        new Set(menuAndPowers.reduce((a, b) => [...a, ...b.powers], []))
      ),
    });
    if (!res4 || res4.status !== 200) {
      // 权限查询失败
      return res4;
    }
    powers = res4.data.filter((item) => item.conditions === 1);
    return { status: 200, data: { userBasicInfo, roles, menus, powers } };
  }

  // 记住密码按钮点击
  onRemember(e) {
    this.setState({
      rememberPassword: e.target.checked,
    });
  }

  // 验证码改变时触发
  onVcodeChange(code) {
    setTimeout(() => {
      this.form.current.setFieldsValue({
        vcode: code, // 开发模式自动赋值验证码，正式环境，这里应该赋值''
      });
      this.setState({
        codeValue: code,
      });
    });
  }

  render() {
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
          <Form ref={this.form}>
            <div className="title">
              <img src={LogoImg} alt="logo" />
              <span>React-Admin</span>
            </div>
            <div>
              <Form.Item
                name="username"
                rules={[
                  { max: 12, message: "最大长度为12位字符" },
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入用户名",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ fontSize: 13 }} />}
                  size="large"
                  id="username" // 为了获取焦点
                  placeholder="admin/user"
                  onPressEnter={() => this.onSubmit()}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "请输入密码" },
                  { max: 18, message: "最大长度18个字符" },
                ]}
              >
                <Input
                  prefix={<KeyOutlined style={{ fontSize: 13 }} />}
                  size="large"
                  type="password"
                  placeholder="123456/123456"
                  onPressEnter={() => this.onSubmit()}
                />
              </Form.Item>
              <Form.Item>
                <Form.Item
                  name="vcode"
                  noStyle
                  rules={[
                    () => ({
                      validator: (rule, value) => {
                        const v = tools.trim(value);
                        if (v) {
                          if (v.length > 4) {
                            return Promise.reject("验证码为4位字符");
                          } else if (
                            v.toLowerCase() !==
                            this.state.codeValue.toLowerCase()
                          ) {
                            return Promise.reject("验证码错误");
                          } else {
                            return Promise.resolve();
                          }
                        } else {
                          return Promise.reject("请输入验证码");
                        }
                      },
                    }),
                  ]}
                >
                  <Input
                    style={{ width: "200px" }}
                    size="large"
                    id="vcode" // 为了获取焦点
                    placeholder="请输入验证码"
                    onPressEnter={() => this.onSubmit()}
                  />
                </Form.Item>
                <Vcode
                  height={40}
                  width={150}
                  onChange={(code) => this.onVcodeChange(code)}
                  className="vcode"
                  options={{
                    lines: 16,
                  }}
                />
              </Form.Item>
              <div style={{ lineHeight: "40px" }}>
                <Checkbox
                  className="remember"
                  checked={this.state.rememberPassword}
                  onChange={(e) => this.onRemember(e)}
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

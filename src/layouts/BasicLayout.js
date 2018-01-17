/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 必需的各种插件
// ==================
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import { Link, Route, Switch, Redirect} from 'react-router-dom';

// ==================
// 路由子页面
// ==================
import Bundle from '../a_component/bundle';
import lazeNotFound from 'bundle-loader?lazy&name=notfound!../a_container/notfound';
import lazeHome from 'bundle-loader?lazy&name=home!../a_container/home';
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);
const Home = (props) => (<Bundle load={lazeHome}>{(Home) => <Home {...props} />}</Bundle>);

// ==================
// 所需的所有组件
// ==================
import { Layout, message } from 'antd';
import Header from '../a_component/Header';
import Menu from '../a_component/Menu';
import Footer from '../a_component/Footer';
import Bread from '../a_component/Bread';
import css from './BasicLayout.scss';


// ==================
// 本页面所需action
// ==================

import { onLogout, setUserInfo } from '../a_action/app-action';

// ==================
// Class
// ==================
const { Content } = Layout;
@connect(
    (state) => ({
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ onLogout, setUserInfo }, dispatch),
    })
)
export default class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 侧边栏是否收起
        };
    }

    /** 点击切换菜单状态 **/
    onToggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /**
     * 退出登录
     * **/
    onLogout = () => {
        console.log('触发0？');
        this.props.actions.onLogout().then(() => {
            message.success('退出成功');
            this.props.history.push('/');
        });
    };

    render() {
        console.log('当前userinfo:', this.props.userinfo);
        return (
            <Layout className={css.page}>
                <Menu collapsed={this.state.collapsed} />
                <Layout>
                    <Header
                        collapsed={this.state.collapsed}
                        userinfo={this.props.userinfo}
                        onToggle={this.onToggle}
                        onLogout={this.onLogout}
                    />
                    <Bread />
                    <Content className={css.content}>
                        <Switch>
                            <Redirect exact from="/" to="/home" />
                            <Route exact path="/home" component={Home} />
                            <Route render={NotFound} />
                        </Switch>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        );
    }
}

// ==================
// PropTypes
// ==================

AppContainer.propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    userinfo: P.any,
};
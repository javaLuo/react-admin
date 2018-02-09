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
import lazeNotFound from 'bundle-loader?lazy&name=notfound!../a_container/Notfound';
import lazeHome from 'bundle-loader?lazy&name=home!../a_container/home';
import lazeMenuAdmin from 'bundle-loader?lazy&name=menuadmin!../a_container/System/MenuAdmin';
import lazePowerAdmin from 'bundle-loader?lazy&name=poweradmin!../a_container/System/PowerAdmin';
import lazeRoleAdmin from 'bundle-loader?lazy&name=roleadmin!../a_container/System/RoleAdmin';
import lazeUserAdmin from 'bundle-loader?lazy&name=useradmin!../a_container/System/UserAdmin';
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(Com) => <Com {...props} />}</Bundle>);
const Home = (props) => (<Bundle load={lazeHome}>{(Com) => <Com {...props} />}</Bundle>);
const MenuAdmin = (props) => (<Bundle load={lazeMenuAdmin}>{(Com) => <Com {...props} />}</Bundle>);
const PowerAdmin = (props) => (<Bundle load={lazePowerAdmin}>{(Com) => <Com {...props} />}</Bundle>);
const RoleAdmin = (props) => (<Bundle load={lazeRoleAdmin}>{(Com) => <Com {...props} />}</Bundle>);
const UserAdmin = (props) => (<Bundle load={lazeUserAdmin}>{(Com) => <Com {...props} />}</Bundle>);

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

import { onLogout, setUserInfo, getNews, clearNews, getNewsTotal } from '../a_action/app-action';

// ==================
// Class
// ==================
const { Content } = Layout;
@connect(
    (state) => ({
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ onLogout, setUserInfo, getNews, clearNews, getNewsTotal }, dispatch),
    })
)
export default class AppContainer extends React.Component {
    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
        userinfo: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 侧边栏是否收起
            newsData: { // 用户消息数据
                notice: [],
                message: [],
                work: []
            },
            newsTotal: 0,
            popLoading: false,  // 用户消息是否正在加载
            clearLoading: false,// 用户消息是否正在清楚
        };
    }

    componentDidMount(){
        // 获取当前共有多少条新消息
        this.props.actions.getNewsTotal().then((res) => {
            if (res.status === 200) {
                this.setState({
                    newsTotal: res.data,
                });
            }
        });
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

    /**
     * 获取用户消息数据
     * **/
    getNews = () => {
        this.setState({
            popLoading: true,
        });
        this.props.actions.getNews().then((res) => {
            if (res.status === 200) {
                console.log('AAAA:', res, res.data.notice.length);
                this.setState({
                    newsData: res.data,
                    newsTotal: res.total,
                });
            }
            this.setState({
                popLoading: false,
            });
        }).catch(() => {
            this.setState({
                popLoading: false,
            });
        });
    };

    /**
     * 删除用户消息数据
     * **/
    clearNews = (type) => {
        this.setState({
            clearLoading: true,
        });
        console.log('到这里了：', type);
        this.props.actions.clearNews({type}).then((res) => {
            if (res.status === 200) {
                this.setState({
                    newsData: res.data,
                    newsTotal: res.total,
                });
                message.success('删除成功');
            } else {
                message.success('删除失败');
            }
            this.setState({
                clearLoading: false,
            });
        }).catch(() => {
            this.setState({
                clearLoading: false,
            });
        });
    };

    render() {
        const u = this.props.userinfo;

        return (
            <Layout className={css.page}>
                <Menu
                    data={u && u.menus ? u.menus : []}
                    collapsed={this.state.collapsed}
                    location={this.props.location}
                />
                <Layout>
                    <Header
                        collapsed={this.state.collapsed}
                        userinfo={this.props.userinfo}
                        onToggle={this.onToggle}
                        onLogout={this.onLogout}
                        getNews={this.getNews}
                        clearNews={this.clearNews}
                        newsData={this.state.newsData}
                        newsTotal={this.state.newsTotal}
                        popLoading={this.state.popLoading}
                        clearLoading={this.state.clearLoading}
                    />
                    <Bread
                        menus={u && u.menus ? u.menus : []}
                        location={this.props.location}
                    />
                    <Content className={css.content}>
                        <Switch>
                            <Redirect exact from="/" to="/home" />
                            <Redirect exact from="/system" to="/system/menuadmin" />
                            <Route exact path="/home" component={Home} />
                            <Route exact path="/system/menuadmin" component={MenuAdmin} />
                            <Route exact path="/system/poweradmin" component={PowerAdmin} />
                            <Route exact path="/system/roleadmin" component={RoleAdmin} />
                            <Route exact path="/system/useradmin" component={UserAdmin} />
                            <Route render={NotFound} />
                        </Switch>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        );
    }
}
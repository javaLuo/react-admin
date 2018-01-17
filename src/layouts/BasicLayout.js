/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的各种插件
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
import lazeNotFound from 'bundle-loader?lazy&name=home!../a_container/notfound';
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);

// ==================
// 所需的所有组件
// ==================
import { Layout, Breadcrumb } from 'antd';
import Header from '../a_component/Header';
import Menu from '../a_component/Menu';
import Footer from '../a_component/Footer';
import Bread from '../a_component/Bread';
import css from './BasicLayout.scss';


// ==================
// 本页面所需action
// ==================


// ==================
// Class
// ==================
const { Content } = Layout;
@connect(
    (state) => ({
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)
export default class AppContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 侧边栏是否收起
        };
    }

    // 点击切换
    onToggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout className={css.page}>
                <Menu collapsed={this.state.collapsed} />
                <Layout>
                    <Header
                        collapsed={this.state.collapsed}
                        onToggle={this.onToggle}
                    />
                    <Bread />
                    <Content className={css.content}>
                        <Switch>
                            <Redirect exact from="/" to="/dashboard/analysis" />
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
};
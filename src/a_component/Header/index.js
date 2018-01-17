/** 头部 **/
import React from 'react';
import P from 'prop-types';
import { Layout, Icon, Tooltip, Avatar, Menu, Dropdown, message } from 'antd';
import c from 'classnames';
import css from './index.scss';

const { Header } = Layout;
export default class Com extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false, // 当前是否是全屏状态
        };
    }

    /** 点击左侧按钮时触发 **/
    toggle = () => {
        this.props.onToggle();
    };

    /**
     * 进入全屏
     * **/
    requestFullScreen = () => {
        const element = document.documentElement;
        // 判断各种浏览器，找到正确的方法
        const requestMethod = element.requestFullScreen || //W3C
            element.webkitRequestFullScreen ||    //Chrome等
            element.mozRequestFullScreen || //FireFox
            element.msRequestFullScreen; //IE11
        if (requestMethod) {
            requestMethod.call(element);
        }
        else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            const wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        this.setState({
            fullScreen: true,
        });
    };

    /**
     * 退出全屏
     */
    exitFullScreen = () => {
        // 判断各种浏览器，找到正确的方法
        const exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen ||    //Chrome等
            document.webkitExitFullscreen;
        if (exitMethod) {
            exitMethod.call(document);
        }
        else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            const wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        this.setState({
            fullScreen: false,
        });
    };

    /**
     * 退出登录
     * **/
    onMenuClick = (e) => {
        console.log('header触发', e);
        if (e.key === 'logout') {   // 退出按钮被点击
            this.props.onLogout();
        }
    };

    render() {
        const userinfo = this.props.userinfo || {};
        return (
            <Header className={css.header}>
                <Tooltip
                    placement="bottom"
                    title={this.props.collapsed ? '展开菜单' : '收起菜单'}
                >
                    <Icon
                        className={c(css.trigger, {[css.fold]: !this.props.collapsed}, 'flex-none')}
                        type={'menu-unfold'}
                        onClick={this.toggle}
                    />
                </Tooltip>
                <div className={c(css.rightBox, 'flex-auto flex-row flex-je')}>
                    <Tooltip
                        placement="bottom"
                        title={this.state.fullScreen ? '退出全屏' : '全屏'}
                    >
                    <Icon
                        className={c(css.full, 'flex-none')}
                        type={this.state.fullScreen ? 'shrink' : 'arrows-alt'}
                        onClick={this.state.fullScreen ? this.exitFullScreen : this.requestFullScreen}
                    />
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <Menu className={css.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                                <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
                                <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="logout" ><Icon type="logout" />退出登录</Menu.Item>
                            </Menu>
                        }
                        placement="bottomRight"
                    >
                        <div className={c(css.userhead, 'flex-row flex-ac')}>
                            <Avatar size="small" icon={'user'} />
                            <span className={css.username}>{userinfo.username}</span>
                        </div>
                    </Dropdown>
                </div>
            </Header>
        );
    }
}

Com.propTypes = {
    onToggle: P.func,   // 菜单收起与展开状态切换
    collapsed: P.bool,  // 菜单的状态
    onLogout: P.func,   // 退出登录
    userinfo: P.object, // 用户信息
};

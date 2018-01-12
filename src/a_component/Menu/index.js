/** 左侧导航 **/
import React from 'react';
import P from 'prop-types';
import { Layout, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import c from 'classnames';
import css from './index.scss';
import ImgLogo from '../../assets/logo.png';

const { Sider } = Layout;
const { SubMenu } = Menu;
export default class Com extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Sider
                width={256}
                className={css.sider}
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
            >
                <div className={this.props.collapsed ? c(css.menuLogo, css.hide) : css.menuLogo }>
                    <Link to='/'>
                        <img src={ImgLogo} />
                        <div>React-Admin</div>
                    </Link>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <SubMenu key="sub1" title={<span><Icon type="setting" /><span>系统管理</span></span>}>
                        <Menu.Item key="5">用户管理</Menu.Item>
                        <Menu.Item key="6">角色管理</Menu.Item>
                        <Menu.Item key="7">权限管理</Menu.Item>
                        <Menu.Item key="8">菜单管理</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="2">
                        <Icon type="video-camera" />
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload" />
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

Com.propTypes = {
    collapsed: P.bool,
};

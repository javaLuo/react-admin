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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
                    <Menu.Item key="home">
                        <Link to={'/home'}>
                            <Icon type="home" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="setting" /><span>系统管理</span></span>}>
                        <Menu.Item key="5"><Link to={'/consumer'}>用户管理</Link></Menu.Item>
                        <Menu.Item key="6"><Link to={'/system/roleadmin'}>角色管理</Link></Menu.Item>
                        <Menu.Item key="7"><Link to={'/system/poweradmin'}>权限管理</Link></Menu.Item>
                        <Menu.Item key="8"><Link to={'/system/menuadmin'}>菜单管理</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

Com.propTypes = {
    collapsed: P.bool,
};

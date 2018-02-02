/** 左侧导航 **/
import React from 'react';
import P from 'prop-types';
import { Layout, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import c from 'classnames';
import css from './index.scss';
import ImgLogo from '../../assets/logo.png';
import _ from 'lodash';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;
export default class Com extends React.PureComponent {
    static propTypes = {
        data: P.array,      // 所有的菜单数据
        collapsed: P.bool,  // 菜单咱开还是收起
    };

    constructor(props) {
        super(props);
        this.state = {
            sourceData: [], // 菜单数据（层级）
            treeDom: [],    // 生成的菜单结构
        };
    }

    componentDidMount() {
        this.makeSourceData(this.props.data);
    }

    componentWillReceiveProps(nextP) {
        console.log('数据是什么：', nextP.data);
        if (this.props.data !== nextP.data) {
            this.makeSourceData(nextP.data);
        }
    }

    /** 处理原始数据，将原始数据处理为层级关系 **/
    makeSourceData(data) {
        const d = _.cloneDeep(data);
        // 按照sort排序
        d.sort((a, b) => {
            return a.sorts - b.sorts;
        });
        const sourceData = this.dataToJson(null, d) || [];
        const treeDom = this.makeTreeDom(sourceData, '');
        console.log('得到了什么2：', sourceData, treeDom);
        this.setState({
            sourceData,
            treeDom
        });
    }

    /** 工具 - 递归将扁平数据转换为层级数据 **/
    dataToJson(one, data) {
        let kids;
        if (!one) { // 第1次递归
            kids = data.filter((item) => !item.parent);
        } else {
            kids = data.filter((item) => item.parent === one.id);
        }
        kids.forEach((item) => item.children = this.dataToJson(item, data));
        return kids.length ? kids : null;
    }

    /** 构建树结构 **/
    makeTreeDom(data, key) {
        return data.map((item, index) => {
            const newKey = `${key}/${item.url.replace(/\//,'')}`;
            if (item.children) {
                return (
                    <SubMenu key={newKey} title={item.parent ? item.title : <span><Icon type="setting" /><span>{item.title}</span></span>}>
                        { this.makeTreeDom(item.children, newKey) }
                    </SubMenu>
                );
            } else {
                return <Item key={newKey}><Link to={newKey}>{item.title}</Link></Item>;
            }
        });
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
                    {this.state.treeDom}
                </Menu>
            </Sider>
        );
    }
}

{/*<Menu.Item key="home">*/}
    {/*<Link to={'/home'}>*/}
        {/*<Icon type="home" />*/}
        {/*<span>首页</span>*/}
    {/*</Link>*/}
{/*</Menu.Item>*/}
{/*<SubMenu key="sub1" title={<span><Icon type="setting" /><span>系统管理</span></span>}>*/}
{/*<Menu.Item key="5"><Link to={'/system/useradmin'}>用户管理</Link></Menu.Item>*/}
{/*<Menu.Item key="6"><Link to={'/system/roleadmin'}>角色管理</Link></Menu.Item>*/}
{/*<Menu.Item key="7"><Link to={'/system/poweradmin'}>权限管理</Link></Menu.Item>*/}
{/*<Menu.Item key="8"><Link to={'/system/menuadmin'}>菜单管理</Link></Menu.Item>*/}
{/*</SubMenu>*/}
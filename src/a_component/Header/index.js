/** 头部 **/
import React from 'react';
import P from 'prop-types';
import { Layout, Icon } from 'antd';
import c from 'classnames';
import css from './index.scss';

const { Header } = Layout;
export default class Com extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // 点击左侧按钮时触发
    toggle = () => {
        this.props.onToggle();
    };

    render() {
        return (
            <Header className={css.header}>
                <Icon
                    className={this.props.collapsed ? css.trigger : c(css.trigger, css.fold)}
                    type={'menu-unfold'}
                    onClick={this.toggle}
                />
            </Header>
        );
    }
}

Com.propTypes = {
    onToggle: P.func,
    collapsed: P.bool,
};

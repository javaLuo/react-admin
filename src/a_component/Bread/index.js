/** 通用动态面包屑 **/
import React from 'react';
import P from 'prop-types';
import { Breadcrumb, Icon } from 'antd';
import c from 'classnames';
import css from './index.scss';

export default class Com extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className={css.bread}>
                <Icon className={css.icon} type="environment-o" />
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        );
    }
}

Com.propTypes = {
    onToggle: P.func,
    collapsed: P.bool,
};
